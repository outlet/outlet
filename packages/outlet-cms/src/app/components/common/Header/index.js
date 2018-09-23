import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { Toolbar, Text, NavLink as Link } from 'rebass';
import { withAdmin, withLogout } from '@hocs/auth';

class HeaderView extends Component {
  static propTypes = {
    currentAdmin: PropTypes.object,
    logout: PropTypes.func.isRequired
  }

  logout = () => {
    const { logout } = this.props;

    return logout();
  }

  renderUser = () => {
    const { currentAdmin: admin } = this.props;

    if (admin) {
      return (
        <Fragment>
          <Link ml="auto">
            <Text is="span">{admin.username}</Text>
          </Link>
          <Link is="a" children="Logout" onClick={this.logout} />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Link ml="auto" is={NavLink} to="/login" children="Login" />
      </Fragment>
    );
  }

  render() {
    return (
      <Toolbar>
        <Link is={NavLink} to="/" children="Home" />
        <Link is={NavLink} to="/products" children="Products" />
        {this.renderUser()}
      </Toolbar>
    );
  }
}

export default withAdmin(withLogout(withRouter(HeaderView)));
