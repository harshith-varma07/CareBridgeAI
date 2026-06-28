import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'CareBridge API', version: '1.0.0' },
    servers: [{ url: '/api' }],
    paths: {
      '/auth/register': { post: { summary: 'Register user' } },
      '/auth/login': { post: { summary: 'Login user' } },
      '/patients': { get: { summary: 'List patients' }, post: { summary: 'Create patient' } },
      '/patients/{id}': { get: { summary: 'Get patient' }, put: { summary: 'Update patient' } },
      '/responses': { post: { summary: 'Submit daily response' } },
      '/responses/{patientId}': { get: { summary: 'List patient responses' } },
      '/ai/analyze': { post: { summary: 'Trigger AI analysis' } },
      '/reports/{patientId}': { get: { summary: 'List risk reports' } },
      '/notifications': { get: { summary: 'List notifications' } }
    }
  },
  apis: []
});
