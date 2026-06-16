# 🔐 Authentication Service

A production-ready **Authentication Microservice** built with **Node.js, TypeScript, RabbitMQ, MySQL, Sequelize, and Elasticsearch**, responsible for user registration, authentication, authorization, and identity management within a distributed microservices architecture.

The service acts as the central authentication layer of the platform, providing secure user onboarding, JWT-based authentication, event-driven communication, and centralized monitoring.

---

## 🚀 Project Overview

The Authentication Service is responsible for managing user identities and access control across the platform.

When a new user registers, the service validates the request, securely stores user credentials, generates authentication tokens, and publishes an event to RabbitMQ. Downstream services consume these events to create associated user profiles and initialize related resources.

The service follows modern **Microservices** and **Event-Driven Architecture** principles, ensuring scalability, maintainability, and fault tolerance.

---

## 🎯 Business Responsibilities

The Authentication Service handles:

- User registration and onboarding
- User authentication and login
- JWT token generation and validation
- Identity management
- Secure credential storage
- Event publishing for newly created users
- Authorization support for protected resources
- Centralized authentication across microservices

---

## ✨ Features

### 👤 User Registration & Authentication

- Secure account creation
- User login and authentication
- Password hashing and validation
- Session management
- JWT token generation

### 🔐 Authorization & Security

- Route-level protection
- JWT verification middleware
- Authentication guards
- Secure token handling
- Input validation and sanitization

### 📨 Event-Driven Communication

- RabbitMQ-based event publishing
- User creation events
- Decoupled service communication
- Reliable message delivery

### 🗄️ Database Management

- MySQL integration
- Sequelize ORM
- Database migrations
- Model associations and relationships

### 📊 Logging & Monitoring

- Elasticsearch integration
- Centralized error logging
- Application monitoring
- Operational visibility through Kibana

### 🌱 Development & Testing

- Faker-powered seed data generation
- Local development support
- Dockerized environment

---

## 🏛️ Architecture Highlights

This service implements several modern backend engineering patterns:

- Event-Driven Architecture
- JWT-Based Authentication
- Service Decoupling via RabbitMQ
- Centralized Logging
- ORM-Based Database Access
- Dockerized Deployments
- Scalable Microservices Design

The Authentication Service serves as the **source of truth for user identity** throughout the platform.

---

## 🔄 Authentication Workflow

```text
Client Application
        │
        ▼
Authentication Service
        │
        ├── Validate User Data
        │
        ├── Store User in MySQL
        │
        ├── Generate JWT Token
        │
        ├── Publish Event to RabbitMQ
        │
        ▼
Users Service
        │
        ▼
Create Buyer Profile

Logs → Elasticsearch → Kibana
```

---

## 🛠️ Technology Stack

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| Node.js       | Backend Runtime            |
| Express.js    | Web Framework              |
| TypeScript    | Type Safety                |
| RabbitMQ      | Event Messaging            |
| MySQL         | Relational Database        |
| Sequelize     | ORM                        |
| JWT           | Authentication             |
| Elasticsearch | Log Storage                |
| Kibana        | Monitoring & Visualization |
| Faker         | Seed Data Generation       |
| Docker        | Containerization           |

---

## 📊 Infrastructure Services

| Service             | URL                    | Purpose                 |
| ------------------- | ---------------------- | ----------------------- |
| RabbitMQ Management | http://localhost:15672 | Queue Monitoring        |
| Elasticsearch       | http://localhost:9200  | Log Storage & Search    |
| Kibana              | http://localhost:5601  | Monitoring Dashboard    |
| MySQL               | localhost:3306         | Authentication Database |
| Cloudinary          | https://cloudinary.com | Media Storage           |

---

## 📦 Local Development Setup

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd 3-auth-service
```

---

### 2️⃣ Configure Shared Library

Ensure your shared library package is already published.

Copy the `.npmrc` file from your shared library project and configure:

```ini
//npm.pkg.github.com/:_authToken=<YOUR_PERSONAL_ACCESS_TOKEN>
```

If required, replace:

```text
@rayeeskha/jobber-shared
```

with your own shared library package name.

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Configure Environment Variables

Copy:

```text
.env.dev
```

to:

```text
.env
```

---

### Cloudinary Configuration

Create an account at:

```text
https://cloudinary.com
```

Add the following values:

```env
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

---

### JWT Configuration

Generate secure values for:

```env
JWT_TOKEN=
GATEWAY_JWT_TOKEN=
```

> The same JWT secrets must be shared across services that require authentication.

---

### 5️⃣ Run the Service

```bash
npm run dev
```

---

## ⚙️ Environment Variables

```env
PORT=4002

CLIENT_URL=http://localhost:3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=jobber_auth

RABBITMQ_ENDPOINT=amqp://localhost

ELASTIC_SEARCH_URL=http://localhost:9200

JWT_TOKEN=
GATEWAY_JWT_TOKEN=

CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

---

## 📁 Project Structure

```text
src/
├── controllers/
├── services/
├── routes/
├── queues/
├── database/
├── seeds/
├── helpers/
├── middleware/
├── app.ts
└── server.ts
```

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing and secure credential storage
- Request validation
- Protected routes and authorization checks
- Secure token generation and verification
- Centralized authentication management

---

## 📈 Monitoring & Observability

The service provides centralized monitoring using Elasticsearch and Kibana.

Features include:

- Application log aggregation
- Error monitoring
- Operational visibility
- Searchable logs
- Production troubleshooting support

---

## 🐳 Docker Deployment

### Login to Docker Hub

```bash
docker login
```

### Build Docker Image

```bash
docker build --build-arg NPM_TOKEN=<YOUR_GITHUB_TOKEN> -t rayeeskhandev/jobber-auth .
```

### Tag Docker Image

```bash
docker tag rayeeskhandev/jobber-auth rayeeskhandev/jobber-auth:stable
```

### Push Docker Image

```bash
docker push rayeeskhandev/jobber-auth:stable
```

### Quick Commands

```bash
docker login

docker build --build-arg NPM_TOKEN=<YOUR_GITHUB_TOKEN> -t rayeeskhandev/jobber-auth .

docker tag rayeeskhandev/jobber-auth rayeeskhandev/jobber-auth:stable

docker push rayeeskhandev/jobber-auth:stable
```

---

## 🚀 Engineering Highlights

- Designed and implemented a scalable Authentication Microservice
- Built event-driven communication using RabbitMQ
- Implemented JWT-based authentication and authorization
- Integrated MySQL using Sequelize ORM
- Established centralized logging with Elasticsearch
- Built monitoring capabilities using Kibana
- Dockerized the service for consistent deployments
- Developed using TypeScript for maintainability and type safety
- Followed microservices architecture best practices

---

## 👨‍💻 Author

**Rayees Khan**

Backend Developer specializing in:

- Node.js
- TypeScript
- Microservices Architecture
- RabbitMQ
- Docker
- Elasticsearch
- Kibana
- AWS
- REST APIs
- System Design
