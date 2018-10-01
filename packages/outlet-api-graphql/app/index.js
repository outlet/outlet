import '@config/init';
import server from './server';

// This check is required to prevent test environments from starting the server
// over and over again.
if (!module.parent) {
  startServer();
}

function startServer() {
  const port = process.env.PORT || process.env.APPLICATION_PORT || 3000;

  return server.listen(port, error => {
    if (error) {
      console.error(error);
    } else {
      console.info(`Application server mounted on port ${port}.`);
    }
  });
}
