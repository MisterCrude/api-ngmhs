const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');


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

  server.route({
    method: 'GET',
    path: '/api/v1/paintings',
    config: {
      description: 'Get all the paintings',
      tags: ['api', 'v1', 'painting']
    },
    handler: (request, reply) => Painting.find()
  });

  server.route({
    method: 'POST',
    path: '/api/v1/paintings',
    handler: (request, reply) => {
      const { name, url, techniques } = request.payload;
      const painting = new Painting({
        name,
        url,
        techniques
      });

      return painting.save();
    }
  });

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      },
      route: {
        cors: true
      }
    }
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Paintings API Documentation'
        }
      }
    }
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

mongoose.connect('mongodb://admin:qweqweqwe@localhost:27017/tutorial');
mongoose.connection.once('open', () => {
  console.log('Connected to database');
});

init();