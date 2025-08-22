// Import dotenv and run configuration
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// notes
const notes = require('./api/notes'); // Import API modules
const NotesService = require('./services/postgres/NotesService'); // Import services
const NotesValidator = require('./validator/notes'); // Import validators
const ClientError = require('./exceptions/ClientError'); // Custom client error class

// users
const users = require('./api/users'); // Import API modules
const UsersService = require('./services/postgres/UsersService'); // Import services
const UsersValidator = require('./validator/users'); // Import validators

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();

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
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  // Global error handling with onPreResponse extension
  server.ext('onPreResponse', (request, h) => {
    const { response } = request; // Extract the response object

    // If not an error, continue to route handler
    if (!(response instanceof Error)) {
      return h.continue;
    }

    let newResponse;

    // Handle controlled errors from our custom ClientError class
    if (response instanceof ClientError) {
      newResponse = h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    // Handle Hapi's internal (Boom) errors
    else if (response.isBoom) {
      const { statusCode, payload } = response.output;

      // Handle server errors (5xx)
      if (statusCode >= 500) {
        console.error('Internal server error:', response); // DEBUG: inspect in server logs
        newResponse = h.response({
          status: 'error',
          message: 'Terjadi kegagalan pada server kami',
        }).code(statusCode);
      } else {  // Handle client errors (4xx) like validation failures
        newResponse = h.response({
          status: 'fail',
          message: payload.message, // <-- Use payload.message for Hapi validation messages
        }).code(statusCode);
      }
    }

    // Choose Content-Type based on route path
    const path = request.route.path;
    if (path.startsWith('/users')) {
      newResponse.type('application/json; charset=utf-8'); // with space
    } else if (path.startsWith('/notes')) {
      newResponse.type('application/json;charset=utf-8'); // without space
    } else {
      newResponse.type('application/json');
    }

    return newResponse;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();