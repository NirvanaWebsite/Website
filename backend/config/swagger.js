const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nirvana Club API',
      version: '1.0.0',
      description: 'A modern full-stack web application API built with Node.js, Express, and MongoDB. Features seamless Clerk authentication for elegant user management.',
      contact: {
        name: 'Nirvana Club Development Team',
        email: 'support@nirvanaclub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.nirvanaclub.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['clerkId', 'email', 'firstName', 'lastName'],
          properties: {
            id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            clerkId: {
              type: 'string',
              description: 'Clerk user identifier',
              example: 'user_2NNEqL2nrIRdJ194ndJqAHgEfxC'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@nirvanaclub.com'
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe'
            },
            profileImage: {
              type: 'string',
              format: 'uri',
              description: 'Profile image URL',
              example: 'https://images.clerk.dev/oauth_google/img_2NNEqL2nrIRdJ194ndJqAHgEfxC'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            clerkId: {
              type: 'string',
              description: 'Clerk user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            profileImage: {
              type: 'string',
              format: 'uri',
              description: 'Profile image URL'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            firstName: {
              type: 'string',
              description: 'Updated first name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Updated last name',
              example: 'Doe'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message description'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'healthy'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
              example: 3600
            },
            mongodb: {
              type: 'string',
              enum: ['connected', 'disconnected'],
              example: 'connected'
            }
          }
        },
        ApiInfo: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Nirvana Club Backend API'
            },
            version: {
              type: 'string',
              example: '1.0.0'
            },
            status: {
              type: 'string',
              example: 'running'
            },
            endpoints: {
              type: 'object',
              properties: {
                users: {
                  type: 'string',
                  example: '/api/users'
                },
                health: {
                  type: 'string',
                  example: '/api/health'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './index.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions: {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #6366f1 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    `,
    customSiteTitle: 'Nirvana Club API Documentation',
    customfavIcon: '/favicon.ico'
  }
};
