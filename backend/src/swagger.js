import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareBridge API',
      version: '1.0.0',
      description: 'Post-surgical AI monitoring platform API for patients, doctors, and administrators.',
    },
    servers: [{ url: '/api', description: 'API base path' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error description' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'field' },
                  msg: { type: 'string', example: 'Invalid value' },
                  path: { type: 'string', example: 'email' },
                  location: { type: 'string', example: 'body' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['PATIENT', 'DOCTOR', 'ADMIN'], example: 'PATIENT' },
            hospitalId: { type: 'string', example: 'HOSP001' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 8, example: 'securePassword123' },
            role: { type: 'string', enum: ['PATIENT', 'DOCTOR', 'ADMIN'], example: 'PATIENT' },
            hospitalId: { type: 'string', example: 'HOSP001' },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', example: 'PATIENT' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'securePassword123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
                role: { type: 'string', example: 'PATIENT' },
                name: { type: 'string', example: 'John Doe' },
              },
            },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e2' },
            userId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            doctorId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e3' },
            age: { type: 'integer', example: 45 },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Male' },
            surgeryType: { type: 'string', example: 'Knee Replacement' },
            surgeryDate: { type: 'string', format: 'date-time', example: '2024-01-15T00:00:00.000Z' },
            expectedRecoveryDuration: { type: 'integer', example: 30 },
            medicalNotes: { type: 'string', example: 'No known allergies' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePatientRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'age', 'gender', 'surgeryType', 'surgeryDate', 'expectedRecoveryDuration'],
          properties: {
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 8, example: 'patientPass123' },
            age: { type: 'integer', minimum: 0, example: 45 },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Female' },
            surgeryType: { type: 'string', example: 'Hip Replacement' },
            surgeryDate: { type: 'string', format: 'date', example: '2024-01-15' },
            expectedRecoveryDuration: { type: 'integer', minimum: 1, example: 30 },
            doctorId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e3' },
            hospitalId: { type: 'string', example: 'HOSP001' },
            medicalNotes: { type: 'string', example: 'Diabetic patient' },
          },
        },
        DailyResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            painLevel: { type: 'integer', minimum: 0, maximum: 10, example: 5 },
            fever: { type: 'boolean', example: false },
            redness: { type: 'boolean', example: true },
            discharge: { type: 'boolean', example: false },
            imageUrl: { type: 'string' },
            submittedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SubmitResponseRequest: {
          type: 'object',
          required: ['patientId', 'painLevel', 'fever', 'redness', 'discharge'],
          properties: {
            patientId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e2' },
            painLevel: { type: 'integer', minimum: 0, maximum: 10, example: 5 },
            fever: { type: 'boolean', example: false },
            redness: { type: 'boolean', example: true },
            discharge: { type: 'boolean', example: false },
            image: { type: 'string', format: 'binary', description: 'Wound image file' },
          },
        },
        RiskReport: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            dailyResponseId: { type: 'string' },
            infectionProbability: { type: 'number', example: 0.35 },
            rednessScore: { type: 'number', example: 0.7 },
            trend: { type: 'string', enum: ['Improving', 'Stable', 'Increasing'], example: 'Stable' },
            risk: { type: 'string', enum: ['GREEN', 'YELLOW', 'RED'], example: 'YELLOW' },
            confidence: { type: 'number', example: 0.85 },
            explanation: { type: 'string', example: 'Moderate redness detected with stable pain levels.' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            type: {
              type: 'string',
              enum: ['DAILY_REMINDER', 'HIGH_RISK_ALERT', 'DOCTOR_NOTIFICATION', 'CRITICAL_PATIENT_NOTIFICATION'],
              example: 'DAILY_REMINDER',
            },
            title: { type: 'string', example: 'Daily Check-In Received' },
            body: { type: 'string', example: 'Your daily check-in has been recorded.' },
            read: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ClinicalNote: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            note: { type: 'string', example: 'Wound healing well, sutures can be removed next week.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateClinicalNoteRequest: {
          type: 'object',
          required: ['patientId', 'note'],
          properties: {
            patientId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e2' },
            note: { type: 'string', example: 'Patient progressing well. Continue current medication.' },
          },
        },
        Medication: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            name: { type: 'string', example: 'Amoxicillin' },
            dosage: { type: 'string', example: '500mg' },
            frequency: { type: 'string', example: 'twice daily' },
            times: { type: 'array', items: { type: 'string' }, example: ['08:00', '20:00'] },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            instructions: { type: 'string', example: 'Take with food' },
            active: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateMedicationRequest: {
          type: 'object',
          required: ['patientId', 'name', 'dosage', 'frequency', 'startDate'],
          properties: {
            patientId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e2' },
            name: { type: 'string', example: 'Amoxicillin' },
            dosage: { type: 'string', example: '500mg' },
            frequency: { type: 'string', example: 'twice daily' },
            times: { type: 'array', items: { type: 'string' }, example: ['08:00', '20:00'] },
            startDate: { type: 'string', format: 'date', example: '2024-01-15' },
            endDate: { type: 'string', format: 'date', example: '2024-02-15' },
            instructions: { type: 'string', example: 'Take with food' },
          },
        },
        MedicationLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            medicationId: { type: 'string' },
            patientId: { type: 'string' },
            scheduledTime: { type: 'string', example: '08:00' },
            takenAt: { type: 'string', format: 'date-time' },
            skipped: { type: 'boolean', example: false },
            notes: { type: 'string', example: 'Taken with breakfast' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LogDoseRequest: {
          type: 'object',
          required: ['scheduledTime'],
          properties: {
            scheduledTime: { type: 'string', example: '08:00' },
            takenAt: { type: 'string', format: 'date-time' },
            skipped: { type: 'boolean', example: false },
            notes: { type: 'string', example: 'Taken with breakfast' },
          },
        },
        PatientDashboard: {
          type: 'object',
          properties: {
            patient: { $ref: '#/components/schemas/Patient' },
            surgeryDayCount: { type: 'integer', example: 12 },
            latestRisk: { $ref: '#/components/schemas/RiskReport' },
            recentResponses: { type: 'array', items: { $ref: '#/components/schemas/DailyResponse' } },
            medicationCompliance: { type: 'number', example: 85 },
            recoveryScore: { type: 'integer', example: 72 },
          },
        },
        DoctorDashboard: {
          type: 'object',
          properties: {
            totalPatients: { type: 'integer', example: 15 },
            criticalCount: { type: 'integer', example: 2 },
            todayCheckIns: { type: 'integer', example: 8 },
            patients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  patient: { $ref: '#/components/schemas/Patient' },
                  latestRisk: { $ref: '#/components/schemas/RiskReport' },
                  lastCheckIn: { $ref: '#/components/schemas/DailyResponse' },
                },
              },
            },
          },
        },
        AIAnalyzeRequest: {
          type: 'object',
          properties: {
            patientId: { type: 'string' },
            painLevel: { type: 'integer', minimum: 0, maximum: 10, example: 5 },
            fever: { type: 'boolean', example: false },
            redness: { type: 'boolean', example: true },
            discharge: { type: 'boolean', example: false },
            imageBase64: { type: 'string', description: 'Base64-encoded wound image' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Create a new user account with the specified role.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterResponse' } } },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            409: { description: 'Email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and obtain JWT token',
          description: 'Authenticate with email and password to receive a JWT token.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/patients': {
        get: {
          tags: ['Patients'],
          summary: 'List patients',
          description: 'Doctors see only their patients. Admins and patients see all.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Array of patients',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Patient' } } } },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        post: {
          tags: ['Patients'],
          summary: 'Create a patient',
          description: 'Doctors/Admins create a patient record along with a User account.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePatientRequest' } } },
          },
          responses: {
            201: { description: 'Patient created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/patients/{id}': {
        get: {
          tags: ['Patients'],
          summary: 'Get a patient by ID',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Patient ObjectId' }],
          responses: {
            200: { description: 'Patient details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['Patients'],
          summary: 'Update a patient',
          description: 'Update allowed fields (doctorId, age, gender, surgeryType, surgeryDate, expectedRecoveryDuration, medicalNotes).',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    age: { type: 'integer' },
                    gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                    surgeryType: { type: 'string' },
                    surgeryDate: { type: 'string', format: 'date' },
                    expectedRecoveryDuration: { type: 'integer' },
                    medicalNotes: { type: 'string' },
                    doctorId: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Patient updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/responses': {
        post: {
          tags: ['Daily Responses'],
          summary: 'Submit a daily response',
          description: 'Submit daily check-in data with optional wound image. Triggers AI analysis and risk notification generation.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: { $ref: '#/components/schemas/SubmitResponseRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Response submitted and analyzed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      dailyResponse: { $ref: '#/components/schemas/DailyResponse' },
                      report: { $ref: '#/components/schemas/RiskReport' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          },
        },
      },
      '/responses/{patientId}': {
        get: {
          tags: ['Daily Responses'],
          summary: 'List daily responses for a patient',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Array of daily responses', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/DailyResponse' } } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/ai/analyze': {
        post: {
          tags: ['AI'],
          summary: 'Trigger AI analysis directly',
          description: 'Send symptom data to the AI service for risk analysis. Falls back to rule-based analysis if AI service is unavailable.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AIAnalyzeRequest' } } },
          },
          responses: {
            200: {
              description: 'Analysis result',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      infectionProbability: { type: 'number' },
                      rednessScore: { type: 'number' },
                      trend: { type: 'string', enum: ['Improving', 'Stable', 'Increasing'] },
                      risk: { type: 'string', enum: ['GREEN', 'YELLOW', 'RED'] },
                      confidence: { type: 'number' },
                      explanation: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/reports/{patientId}': {
        get: {
          tags: ['Risk Reports'],
          summary: 'List risk reports for a patient',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Array of risk reports', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RiskReport' } } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'List notifications for the authenticated user',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Array of notifications', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } } } } },
          },
        },
      },
      '/notifications/{id}/read': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark a single notification as read',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Notification ObjectId' }],
          responses: {
            200: { description: 'Updated notification', content: { 'application/json': { schema: { $ref: '#/components/schemas/Notification' } } } },
            403: { description: 'Forbidden — not your notification', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Notification not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/notifications/read-all': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark all notifications as read',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'All notifications marked as read',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'All notifications marked as read' },
                      modifiedCount: { type: 'integer', example: 5 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/clinical-notes': {
        post: {
          tags: ['Clinical Notes'],
          summary: 'Create a clinical note',
          description: 'Doctors and admins can add clinical notes to a patient record.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClinicalNoteRequest' } } },
          },
          responses: {
            201: { description: 'Clinical note created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ClinicalNote' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/clinical-notes/{patientId}': {
        get: {
          tags: ['Clinical Notes'],
          summary: 'List clinical notes for a patient',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Array of clinical notes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ClinicalNote' } } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/medications': {
        post: {
          tags: ['Medications'],
          summary: 'Add a medication',
          description: 'Doctors/Admins prescribe a medication for a patient.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMedicationRequest' } } },
          },
          responses: {
            201: { description: 'Medication created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Medication' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/medications/{patientId}': {
        get: {
          tags: ['Medications'],
          summary: 'List active medications for a patient',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Array of active medications', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Medication' } } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/medications/{id}': {
        put: {
          tags: ['Medications'],
          summary: 'Update a medication',
          description: 'Update medication fields (name, dosage, frequency, times, startDate, endDate, instructions, active).',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    dosage: { type: 'string' },
                    frequency: { type: 'string' },
                    times: { type: 'array', items: { type: 'string' } },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    instructions: { type: 'string' },
                    active: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Medication updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Medication' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Medication not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Medications'],
          summary: 'Deactivate a medication (soft delete)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: {
              description: 'Medication deactivated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Medication deactivated' },
                      medication: { $ref: '#/components/schemas/Medication' },
                    },
                  },
                },
              },
            },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Medication not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/medications/{id}/log': {
        post: {
          tags: ['Medications'],
          summary: 'Log a dose taken',
          description: 'Patients log when they take or skip a dose.',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Medication ObjectId' }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LogDoseRequest' } } },
          },
          responses: {
            201: { description: 'Dose logged', content: { 'application/json': { schema: { $ref: '#/components/schemas/MedicationLog' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Medication not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/medications/{patientId}/logs': {
        get: {
          tags: ['Medications'],
          summary: 'Get medication logs for compliance tracking',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Array of medication logs', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/MedicationLog' } } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Patient not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/dashboard/patient': {
        get: {
          tags: ['Dashboard'],
          summary: 'Patient dashboard',
          description: 'Aggregated dashboard data including surgery progress, latest risk, recent responses, medication compliance, and recovery score.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Patient dashboard data', content: { 'application/json': { schema: { $ref: '#/components/schemas/PatientDashboard' } } } },
            404: { description: 'Patient record not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/dashboard/doctor': {
        get: {
          tags: ['Dashboard'],
          summary: 'Doctor dashboard',
          description: 'Aggregated dashboard data including total patients, critical count, today check-ins, and per-patient risk details.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Doctor dashboard data', content: { 'application/json': { schema: { $ref: '#/components/schemas/DoctorDashboard' } } } },
          },
        },
      },
    },
  },
  apis: [],
});
