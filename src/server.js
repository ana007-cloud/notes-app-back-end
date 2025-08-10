// Import dotenv and run configuration
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();

  // Create Hapi server instance
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register notes plugin with service and validator
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  // Global error handling with onPreResponse extension
  server.ext('onPreResponse', (request, h) => {
    const { response } = request; // Extract the response object

    // Handle controlled errors from our custom ClientError class
    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      })
      .code(response.statusCode)
      .header('Content-Type', 'application/json;charset=utf-8');
    }

    // Handle Hapi's internal (Boom) errors
    if (response.isBoom) {
    const { statusCode, payload } = response.output;

    // Handle server errors (5xx)
    if (statusCode >= 500) {
      console.error('Internal server error:', response); // DEBUG: inspect in server logs
      return h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      })
      .code(statusCode)
      .header('Content-Type', 'application/json;charset=utf-8');
    }

    // Handle client errors (4xx) like validation failures
    return h.response({
      status: 'fail',
      message: payload.message, // <-- Use payload.message for Hapi validation messages
    })
    .code(statusCode)
    .header('Content-Type', 'application/json;charset=utf-8');
    }

    // If not an error, let the request continue to the route handler
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();