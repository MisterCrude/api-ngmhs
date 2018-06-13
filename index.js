const hapi = require('hapi');
const mongoose = require('mongoose');


const server = hapi.server({
  port: 4000,
  host: 'localhost'
});

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => `<h1>My modern API</h1>`
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

mongoose.connect('mongodb://admin:qweqweqwe@localhost:27017/tutorial');
mongoose.connection.once('open', () => {
  console.log('Connected to database');
});

init();