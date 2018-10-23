import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Tabs, Tab, Text } from 'rebass';
import { withUser, withLogout } from '@hocs/auth';

class HeaderView extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    logout: PropTypes.func.isRequired
  }

  static defaultProps = {
    currentUser: null
  }

  logout = () => {
    const { logout } = this.props;

    return logout();
  }

  renderAdmin = () => {
    const { currentUser } = this.props;

    if (currentUser.role === 'admin') {
      return (
        <Tab href="/admin">Admin</Tab>
      );
    }

    return null;
  }

  renderUser = () => {
    const { currentUser } = this.props;

    if (currentUser) {
      return (
        <Fragment>
          <Tab><Text>{currentUser.username}</Text></Tab>
          {this.renderAdmin()}
          <Tab onClick={this.logout}>Logout</Tab>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Tab is={NavLink} to="/login">Login</Tab>
        <Tab is={NavLink} to="/signup">Signup</Tab>
      </Fragment>
    );
  }

  render() {
    return (
      <Container>
        <Tabs>
          <Tab is={NavLink} to="/" exact>Home</Tab>
          <Tab is={NavLink} to="/products" exact>Products</Tab>
          {this.renderUser()}
        </Tabs>
      </Container>
    );
  }
}

export default withUser(withLogout(withRouter(HeaderView)));
