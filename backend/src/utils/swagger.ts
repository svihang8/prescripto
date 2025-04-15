import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { SwaggerDefinition } from "swagger-jsdoc";

class Swagger {
    private swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Prescripto API',
                version: '1.0.0',
                description: 'API documentation for Prescripto - A Digital Prescription Management System',
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || "3000"}`,
                    description: 'Development server'
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: {
                    Patient: {
                        type: 'object',
                        required: ['firstName', 'lastName', 'address', 'email', 'password'],
                        properties: {
                            firstName: { type: 'string', description: 'Patient\'s first name' },
                            lastName: { type: 'string', description: 'Patient\'s last name' },
                            address: { type: 'string', description: 'Patient\'s address' },
                            email: { type: 'string', format: 'email', description: 'Patient\'s email address' },
                            password: { type: 'string', format: 'password', description: 'Patient\'s password' }
                        }
                    },
                    Doctor: {
                        type: 'object',
                        required: ['firstName', 'lastName', 'specialization', 'email', 'password'],
                        properties: {
                            firstName: { type: 'string', description: 'Doctor\'s first name' },
                            lastName: { type: 'string', description: 'Doctor\'s last name' },
                            specialization: { type: 'string', description: 'Doctor\'s specialization' },
                            email: { type: 'string', format: 'email', description: 'Doctor\'s email address' },
                            password: { type: 'string', format: 'password', description: 'Doctor\'s password' }
                        }
                    },
                    Pharmacy: {
                        type: 'object',
                        required: ['name', 'address', 'email', 'password'],
                        properties: {
                            name: { type: 'string', description: 'Pharmacy name' },
                            address: { type: 'string', description: 'Pharmacy address' },
                            email: { type: 'string', format: 'email', description: 'Pharmacy email address' },
                            password: { type: 'string', format: 'password', description: 'Pharmacy password' }
                        }
                    },
                    Prescription: {
                        type: 'object',
                        required: ['patientId', 'doctorId', 'medications'],
                        properties: {
                            patientId: { type: 'string', description: 'ID of the patient' },
                            doctorId: { type: 'string', description: 'ID of the doctor' },
                            medications: { 
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string', description: 'Medication name' },
                                        dosage: { type: 'string', description: 'Medication dosage' },
                                        frequency: { type: 'string', description: 'Medication frequency' },
                                        duration: { type: 'string', description: 'Duration of medication' }
                                    }
                                }
                            },
                            status: { type: 'string', enum: ['pending', 'approved', 'rejected'], description: 'Prescription status' }
                        }
                    }
                }
            },
            paths: {
                '/api/prescriptions': {
                    post: {
                        tags: ['Prescriptions'],
                        summary: 'Create a new prescription',
                        description: 'Create a new prescription with patient, doctor, and pharmacist details',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['patientEmail', 'doctorEmail', 'pharmacistEmail', 'drugName', 'drugStrength', 'dosageForm', 'quantity', 'directionsForUse'],
                                        properties: {
                                            patientEmail: { type: 'string', format: 'email', description: 'Patient\'s email address' },
                                            doctorEmail: { type: 'string', format: 'email', description: 'Doctor\'s email address' },
                                            pharmacistEmail: { type: 'string', format: 'email', description: 'Pharmacist\'s email address' },
                                            drugName: { type: 'string', description: 'Name of the drug' },
                                            drugStrength: { type: 'string', description: 'Strength of the drug' },
                                            dosageForm: { type: 'string', description: 'Form of the drug (e.g., tablet, liquid)' },
                                            quantity: { type: 'number', description: 'Quantity of the drug' },
                                            directionsForUse: { type: 'string', description: 'Instructions for using the drug' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'Prescription created successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/Prescription'
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Invalid input data'
                            }
                        }
                    },
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Get all prescriptions',
                        description: 'Retrieve a list of all prescriptions',
                        responses: {
                            '200': {
                                description: 'List of prescriptions',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Prescription'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/prescriptions/{id}': {
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Get a prescription by ID',
                        description: 'Retrieve a specific prescription by its ID',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string'
                                },
                                description: 'Prescription ID'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'Prescription details',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/Prescription'
                                        }
                                    }
                                }
                            },
                            '404': {
                                description: 'Prescription not found'
                            }
                        }
                    },
                    put: {
                        tags: ['Prescriptions'],
                        summary: 'Update a prescription',
                        description: 'Update an existing prescription by its ID',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string'
                                },
                                description: 'Prescription ID'
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Prescription'
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': {
                                description: 'Prescription updated successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/Prescription'
                                        }
                                    }
                                }
                            },
                            '404': {
                                description: 'Prescription not found'
                            }
                        }
                    },
                    delete: {
                        tags: ['Prescriptions'],
                        summary: 'Delete a prescription',
                        description: 'Delete an existing prescription by its ID',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string'
                                },
                                description: 'Prescription ID'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'Prescription deleted successfully'
                            },
                            '404': {
                                description: 'Prescription not found'
                            }
                        }
                    }
                },
                '/api/prescriptions/patient/{email}': {
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Get prescriptions by patient email',
                        description: 'Retrieve all prescriptions for a specific patient',
                        parameters: [
                            {
                                name: 'email',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                    format: 'email'
                                },
                                description: 'Patient\'s email address'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'List of patient\'s prescriptions',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Prescription'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/prescriptions/doctor/{email}': {
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Get prescriptions by doctor email',
                        description: 'Retrieve all prescriptions created by a specific doctor',
                        parameters: [
                            {
                                name: 'email',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                    format: 'email'
                                },
                                description: 'Doctor\'s email address'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'List of doctor\'s prescriptions',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Prescription'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/prescriptions/pharmacist/{email}': {
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Get prescriptions by pharmacist email',
                        description: 'Retrieve all prescriptions handled by a specific pharmacist',
                        parameters: [
                            {
                                name: 'email',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                    format: 'email'
                                },
                                description: 'Pharmacist\'s email address'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'List of pharmacist\'s prescriptions',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Prescription'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/prescriptions/label/{id}': {
                    get: {
                        tags: ['Prescriptions'],
                        summary: 'Generate prescription label',
                        description: 'Generate a prescription label image for a specific prescription',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string'
                                },
                                description: 'Prescription ID'
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'Prescription label image',
                                content: {
                                    'image/png': {
                                        schema: {
                                            type: 'string',
                                            format: 'binary'
                                        }
                                    }
                                }
                            },
                            '404': {
                                description: 'Prescription not found'
                            }
                        }
                    }
                },
                '/api/auth/signup': {
                    post: {
                        tags: ['Authentication'],
                        summary: 'Register a new user',
                        description: 'Register a new user based on their role (patient, doctor, or pharmacy)',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['role', 'data'],
                                        properties: {
                                            role: {
                                                type: 'string',
                                                enum: ['patient', 'doctor', 'pharmacy'],
                                                description: 'User role'
                                            },
                                            data: {
                                                type: 'object',
                                                description: 'Role-specific user data',
                                                oneOf: [
                                                    {
                                                        title: 'Patient Data',
                                                        required: ['firstName', 'lastName', 'address', 'email', 'password'],
                                                        properties: {
                                                            firstName: { type: 'string', description: 'Patient\'s first name' },
                                                            lastName: { type: 'string', description: 'Patient\'s last name' },
                                                            address: { type: 'string', description: 'Patient\'s address' },
                                                            email: { type: 'string', format: 'email', description: 'Patient\'s email address' },
                                                            password: { type: 'string', format: 'password', description: 'Patient\'s password' }
                                                        }
                                                    },
                                                    {
                                                        title: 'Doctor Data',
                                                        required: ['firstName', 'lastName', 'specialization', 'email', 'password'],
                                                        properties: {
                                                            firstName: { type: 'string', description: 'Doctor\'s first name' },
                                                            lastName: { type: 'string', description: 'Doctor\'s last name' },
                                                            specialization: { type: 'string', description: 'Doctor\'s specialization' },
                                                            email: { type: 'string', format: 'email', description: 'Doctor\'s email address' },
                                                            password: { type: 'string', format: 'password', description: 'Doctor\'s password' }
                                                        }
                                                    },
                                                    {
                                                        title: 'Pharmacy Data',
                                                        required: ['name', 'address', 'email', 'password'],
                                                        properties: {
                                                            name: { type: 'string', description: 'Pharmacy name' },
                                                            address: { type: 'string', description: 'Pharmacy address' },
                                                            email: { type: 'string', format: 'email', description: 'Pharmacy email address' },
                                                            password: { type: 'string', format: 'password', description: 'Pharmacy password' }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    examples: {
                                        patient: {
                                            value: {
                                                role: 'patient',
                                                data: {
                                                    firstName: 'John',
                                                    lastName: 'Doe',
                                                    address: '123 Main St',
                                                    email: 'john@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        },
                                        doctor: {
                                            value: {
                                                role: 'doctor',
                                                data: {
                                                    firstName: 'Jane',
                                                    lastName: 'Smith',
                                                    specialization: 'Cardiology',
                                                    email: 'jane@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        },
                                        pharmacy: {
                                            value: {
                                                role: 'pharmacy',
                                                data: {
                                                    name: 'Health Pharmacy',
                                                    address: '456 Medical Ave',
                                                    email: 'pharmacy@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'User successfully registered',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                                token: { type: 'string' },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'string' },
                                                        email: { type: 'string' },
                                                        role: { type: 'string' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Invalid input data',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/auth/signin': {
                    post: {
                        tags: ['Authentication'],
                        summary: 'User login',
                        description: 'Authenticate a user and get JWT token',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['role', 'data'],
                                        properties: {
                                            role: {
                                                type: 'string',
                                                enum: ['patient', 'doctor', 'pharmacy'],
                                                description: 'User role'
                                            },
                                            data: {
                                                type: 'object',
                                                required: ['email', 'password'],
                                                properties: {
                                                    email: { type: 'string', format: 'email', description: 'User\'s email address' },
                                                    password: { type: 'string', format: 'password', description: 'User\'s password' }
                                                }
                                            }
                                        }
                                    },
                                    examples: {
                                        patient: {
                                            value: {
                                                role: 'patient',
                                                data: {
                                                    email: 'john@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        },
                                        doctor: {
                                            value: {
                                                role: 'doctor',
                                                data: {
                                                    email: 'jane@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        },
                                        pharmacy: {
                                            value: {
                                                role: 'pharmacy',
                                                data: {
                                                    email: 'pharmacy@example.com',
                                                    password: 'password123'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': {
                                description: 'Login successful',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                token: { type: 'string' },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'string' },
                                                        email: { type: 'string' },
                                                        role: { type: 'string' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '401': {
                                description: 'Invalid credentials',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/api/transcribe': {
                    post: {
                        tags: ['Transcription'],
                        summary: 'Transcribe an audio file',
                        description: 'Uploads an audio file and returns the transcribed text.',
                        security: [
                            {
                                bearerAuth: []
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            audio: {
                                                type: 'string',
                                                format: 'binary',
                                                description: 'The audio file to transcribe'
                                            }
                                        },
                                        required: ['audio']
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': {
                                description: 'Transcription successful',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                text: {
                                                    type: 'string',
                                                    description: 'The transcribed text'
                                                }
                                            }
                                        },
                                        example: {
                                            text: 'Take 1 tablet of paracetamol twice daily after meals.'
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Bad request - no file uploaded or invalid format'
                            },
                            '401': {
                                description: 'Unauthorized - missing or invalid token'
                            },
                            '500': {
                                description: 'Server error during transcription'
                            }
                        }
                    }
                },
                "/api/patient/{email}": {
                    "get": {
                        "tags": ["Patients"],
                        "summary": "Get patient by email",
                        "description": "Retrieve a specific patient's information using their email address",
                        "parameters": [
                            {
                                "name": "email",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "string",
                                    "format": "email"
                                },
                                "description": "Patient's email address"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Patient details",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Patient"
                                        }
                                    }
                                }
                            },
                            "404": {
                                "description": "Patient not found"
                            }
                        }
                    }
                },
            }
        },
        apis: ['./src/route/*.ts'], // Path to your API docs
    };

    private swaggerDocs:object;
    public swaggerUI;

    constructor() {
        this.swaggerDocs = swaggerJSDoc(this.swaggerOptions);
        this.swaggerUI = swaggerUi;
    }

    public initMiddleware() {
        return [this.swaggerUI.serve, this.swaggerUI.setup(this.swaggerDocs)]
    }
}

export default Swagger;