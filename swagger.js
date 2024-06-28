const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: 'Courses_API',
        description: 'Description'
    },
    host: 'courses-project-iu0w.onrender.com/',
    schemes: ['https']
};

const outputFile = './swagger-output.json';
const routes = [
    './app.js'
];

swaggerAutogen(outputFile, routes, doc);
