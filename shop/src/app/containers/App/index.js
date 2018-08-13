import React from 'react';
import { Switch } from 'react-router-dom';
import { Container } from 'rebass';
import { RouteWithSubRoutes } from '@components/common';
import { Header, Footer } from '@components/common';
import { hot } from 'react-hot-loader';
import { Provider as ThemeProvider } from 'rebass';
import theme from '@themes/default';
import routes from '@routes';

// injectGlobal`
//   * { box-sizing: border-box; }
//   body { margin: 0; background-color: blue; }
// `;


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header />
        <Switch>
          {routes.map(route => (
            <RouteWithSubRoutes key={route.path} {...route} />
          ))}
        </Switch>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default hot(module)(App);
