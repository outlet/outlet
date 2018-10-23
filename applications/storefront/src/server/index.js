import server from './server';

const port = process.env.PORT || process.env.APPLICATION_PORT || 3001;

server.listen(port, () => {
  console.info(`Client application server mounted on port ${port}!`);
});
