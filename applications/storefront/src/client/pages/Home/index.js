import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container, Heading, Text } from 'rebass';

class HomePage extends Component {
  render() {
    return (
      <Container>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Heading>It Works!</Heading>
        <Text>
          You've successfully started up your first universally rendered react
          app powered by GraphQL!<br />
          Hint: Try View Source on this page to see that it was rendered on the
          server as well.
        </Text>
        <Text>
          Check out the <Link to="/products">products list</Link>.
        </Text>
      </Container>
    );
  }
}

export default HomePage;
