import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Container } from 'rebass';
import { Header, RouteWithSubRoutes  } from '@components/common';
import { hot } from 'react-hot-loader';
import routes from '@routes';

class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <div>
          <Switch>
            {routes.map(route => (
              <RouteWithSubRoutes key={route.path} {...route} />
            ))}
          </Switch>
        </div>
      </Container>
    );
  }
}

export default hot(module)(App);
