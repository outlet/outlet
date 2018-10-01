import { raw } from 'objection';
import {
  each,
  get,
  toLower,
  isPlainObject,
  camelCase,
  first as getFirst,
  last as getLast
} from 'lodash';

/**
 * Parses an array of orderBy arguments from GraphQL. These are in the form of
 * `{FIELD_NAME}_{DIRECTION}`, e.g. `CREATED_AT_DESC`.
 * @param  {Array} orderByArr An array of orderBy arguments.
 * @return {Array} An array of orderBy arguments usable by Objection ORM.
 */
const parseOrderBy = orderByArr =>
  orderByArr.map(orderBy => {
    const idx = orderBy.lastIndexOf('_');

    return [
      // the field name
      camelCase(orderBy.slice(0, idx)),

      // the direction
      toLower(orderBy.slice(idx + 1))
    ];
  });

/**
 * Creates an object that can be used to encode a pagination cursor.
 * @param  {Object} row     The data row to cursorize.
 * @param  {Object} orderBy The orderBy conditions specifed by the GQL query
 * @return {Array}          An array of cursorable values based on ordering.
 */
const getCursorValue = (row, orderBy) => {
  return orderBy.map(order => {
    const [field, direction] = order;

    return {
      field,
      value: row[field],
      direction
    };
  });
};

/**
 * Base64 encodes a cursor object.
 * @param  {Object} obj The cursor object to encode.
 * @return {String}     The encoded cursor.
 */
const encodeCursor = obj => Buffer.from(JSON.stringify(obj)).toString('base64');

/**
 * Decodes a base64 cursor object.
 * @param  {String} str The base64 encoded cursor string to decode.
 * @return {Object}     The decoded cursor object.
 */
const decodeCursor = str => JSON.parse(Buffer.from(str, 'base64').toString());

const hasNextOrPreviousPage = (lowerLimit, upperLimit, total) => {
  if (upperLimit) return false;
  return lowerLimit + 1 >= total;
};

const flipDirection = direction => {
  return direction === 'asc' ? 'desc' : 'asc';
};

export default async function createConnection(options = {}) {
  const opts = {
    model: null,
    defaultLimit: 15,
    alphaOrderColumns: [],
    fuzzyMatchColumns: [],
    args: {},
    ...options
  };

  if (!opts.model) {
    throw new Error('Must define a `model` to create a connection.');
  }

  let { first, last, offset, before, after, orderBy, condition } = opts.args;

  const parsedOrderBy = parseOrderBy(orderBy);
  const query = opts.model.query().select(
    raw('*, count(*) OVER() AS fullCount')
  );

  if (first && last) {
    throw new Error('Cannot define both a `first` and a `last` argument.');
  }

  // Apply limit
  query.limit(first || last || opts.defaultLimit);

  // Apply cursors
  if (after) {
    each(decodeCursor(after), cursor => {
      const { field, value, direction: d } = cursor;
      query.where(field, d === 'asc' ? '>' : '<', value);
    });
  } else if (before) {
    each(decodeCursor(before), cursor => {
      const { field, value, direction: d } = cursor;
      query.where(field, d === 'asc' ? '<' : '>', value);
    });
  } else if (offset) {
    query.offset(offset);
  }

  // Apply custom ordering
  if (orderBy) {
    each(parsedOrderBy, order => {
      const [field, direction] = order;

      // if `last` was defined, we need to flip our query direction
      const actual = last ? flipDirection(direction) : direction;

      if (opts.alphaOrderColumns.includes(field)) {
        // case-insensitive alpnumeric ordering
        query.orderBy(raw('LOWER(??)', field), actual);
      } else {
        // regular ordering
        query.orderBy(field, actual);
      }
    });
  }

  // Apply matching conditions
  if (condition && isPlainObject(condition)) {
    each(condition, (value, key) => {
      if (opts.fuzzyMatchColumns.includes(key)) {
        query.where(raw('LOWER(??) LIKE ?', [key, `%${toLower(value)}%`]));
      } else {
        query.where(key, value);
      }
    });
  }

  let rows = await query;

  // if `last` was defined, we need to reverse the immediate sort order to be
  // what's expected.
  if (last) rows = rows.reverse();

  const nodes = rows.map(u => u.toJSON());
  const numNodes = nodes.length;
  const edges = rows.map((row, idx) => ({
    node: nodes[idx],
    cursor: encodeCursor(getCursorValue(row, parsedOrderBy))
  }));

  return {
    totalCount: get(getFirst(rows), 'fullcount', 0),
    nodes,
    edges,
    pageInfo: {
      hasNextPage: hasNextOrPreviousPage(first, last, numNodes),
      hasPreviousPage: hasNextOrPreviousPage(first, last, numNodes),
      startCursor: get(getFirst(edges), 'cursor', null),
      endCursor: get(getLast(edges), 'cursor', null)
    }
  };
}
