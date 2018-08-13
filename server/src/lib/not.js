export default function not(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}
