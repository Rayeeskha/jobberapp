# Jobber Platform Infrastructure & DevOps Setup

## Overview

Jobber is a microservices-based platform designed to support scalable application development, event-driven communication, background job processing, monitoring, logging, and automated deployments.

This repository provides a complete local development and deployment environment using Docker, Kubernetes, Jenkins, GitHub Webhooks, and AWS infrastructure.

The setup enables developers to:

* Run all infrastructure services locally using Docker Compose
* Develop and test microservices independently
* Use RabbitMQ for asynchronous communication
* Store data in MySQL, PostgreSQL, MongoDB, and Redis
* Monitor applications using Elastic Stack (ELK)
* Automate CI/CD pipelines using Jenkins
* Deploy applications to Minikube or AWS EKS clusters

---

# Architecture Overview

```text
┌──────────────────────────────────────────┐
│                Developers                │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│             GitHub Repository            │
└──────────────────┬───────────────────────┘
                   │ Webhook Trigger
                   ▼
┌──────────────────────────────────────────┐
│          Jenkins Controller              │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│            Jenkins Agent                 │
└──────────────────┬───────────────────────┘
                   │
                   ▼
          Docker Image Build
                   │
                   ▼
           Container Registry
                   │
                   ▼
       Kubernetes Deployment
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    Minikube             AWS EKS
```

---

# Technology Stack

## Containerization

* Docker
* Docker Compose

## CI/CD

* Jenkins
* GitHub Webhooks

## Container Orchestration

* Kubernetes
* Minikube
* AWS EKS

## Databases

* MySQL
* PostgreSQL
* MongoDB
* Redis

## Messaging

* RabbitMQ

## Monitoring & Logging

* Elasticsearch
* Kibana
* Metricbeat
* APM Server

## Cloud

* AWS EKS
* AWS ECR
* AWS IAM

---

# Infrastructure Components

| Component     | Purpose                 |
| ------------- | ----------------------- |
| Redis         | Cache & Session Storage |
| MongoDB       | Document Database       |
| MySQL         | Relational Database     |
| PostgreSQL    | Relational Database     |
| RabbitMQ      | Message Broker          |
| Elasticsearch | Log Storage & Search    |
| Kibana        | Log Visualization       |
| Metricbeat    | Infrastructure Metrics  |
| APM Server    | Application Monitoring  |
| Jenkins       | CI/CD Automation        |
| Jenkins Agent | Build Executor          |

---

# Docker Setup Guide

This project uses Docker Compose to run all required infrastructure services including:

* Redis
* MongoDB
* MySQL
* PostgreSQL
* RabbitMQ
* Elasticsearch
* Kibana
* Metricbeat
* APM Server
* Jenkins
* Jenkins Agent

---

# Prerequisites

Ensure the following tools are installed:

* Docker Desktop
* Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

# Start Services

## First Time Setup

```bash
docker compose pull
docker compose build
docker compose up -d
```

## Subsequent Runs

```bash
docker compose up -d
```

## Fast Development Mode

```bash
docker compose up -d redis mongodb mysql postgres rabbitmq elasticsearch kibana metricbeat apmServer jenkins jenkins-agent
```

```bash
docker compose up -d metricbeat
```

```bash
docker compose restart metricbeat
```

---

# Stop Specific Service

Example:

```bash
docker compose stop postgres
```

---

# Check Running Containers

```bash
docker ps
```

---

# Stop All Services

```bash
docker compose down
```

---

# Clean Environment

⚠️ Warning: This removes all databases, queues, and persistent volumes.

```bash
docker compose down -v
```

---

# Services and Ports

| Service       | URL / Port             |
| ------------- | ---------------------- |
| Redis         | localhost:6379         |
| MongoDB       | localhost:27017        |
| MySQL         | localhost:3307         |
| PostgreSQL    | localhost:5432         |
| RabbitMQ UI   | http://localhost:15672 |
| Elasticsearch | http://localhost:9200  |
| Kibana        | http://localhost:5601  |
| Jenkins       | http://localhost:8080  |

---

# RabbitMQ Credentials

```text
Username: jobber
Password: jobberpassword
```

---

# Logs

View all logs:

```bash
docker compose logs -f
```

View specific service logs:

```bash
docker compose logs -f <service-name>
```

Example:

```bash
docker compose logs -f elasticsearch
```

---

# Run Individual Services

```bash
docker compose up -d redis
docker compose up -d mongodb
docker compose up -d mysql
docker compose up -d postgres
docker compose up -d rabbitmq
docker compose up -d elasticsearch
```

Note: Elasticsearch may take 5–10 minutes to become healthy.

---

# Kibana Setup

Update Kibana password:

```bash
curl -X POST -u elastic:admin1234 \
http://localhost:9200/_security/user/kibana_system/_password \
-H "Content-Type: application/json" \
-d '{"password":"kibana"}'
```

Generate Service Token:

```bash
bin/elasticsearch-service-tokens create elastic/kibana jobber-kibana
```

Add generated token to:

```env
ELASTICSEARCH_SERVICEACCOUNT_TOKEN=<your-token>
```

---

# Running Microservices

Start infrastructure:

```bash
docker compose up -d
```

Run services:

```bash
npm run dev
```

Important:

> Start the API Gateway service after all dependent services are healthy.

---

# Jenkins CI/CD Automation

## Purpose

Jenkins is used to automate:

* Build Processes
* Unit Testing
* Docker Image Creation
* Kubernetes Deployment
* AWS EKS Deployment
* Continuous Delivery

---

# Jenkins Setup

## Start Jenkins

```bash
docker compose up -d jenkins
docker compose up -d jenkins-agent
```

Verify:

```bash
docker ps
```

---

# Initial Jenkins Configuration

Access:

```text
http://localhost:8080
```

Retrieve admin password:

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

# Recommended Jenkins Plugins

## Source Control

* Git
* GitHub
* GitHub Branch Source

## Pipeline

* Pipeline
* Pipeline Stage View
* Blue Ocean

## Docker

* Docker
* Docker Pipeline

## Kubernetes

* Kubernetes
* Kubernetes CLI

## AWS

* AWS Credentials
* Pipeline AWS Steps

## Utility

* Credentials Binding
* Workspace Cleanup
* SSH Agent
* Build Timeout

---

# GitHub Webhook Configuration

Repository Settings:

```text
Settings
→ Webhooks
→ Add Webhook
```

Payload URL:

```text
http://<jenkins-host>:8080/github-webhook/
```

Events:

```text
Push
Pull Request
```

---

# Deployment Flow

```text
Developer Pushes Code
          │
          ▼
GitHub Repository
          │
          ▼
GitHub Webhook
          │
          ▼
Jenkins Pipeline
          │
          ▼
Build Application
          │
          ▼
Run Tests
          │
          ▼
Build Docker Image
          │
          ▼
Push Docker Image
          │
          ▼
Deploy to Kubernetes
          │
          ▼
Health Verification
          │
          ▼
Deployment Successful
```

---

# Kubernetes Deployment

## Minikube

```bash
minikube start
```

```bash
kubectl apply -f k8s/
```

---

## AWS EKS

Update kubeconfig:

```bash
aws eks update-kubeconfig \
--region ap-south-1 \
--name jobber-eks
```

Deploy:

```bash
kubectl apply -f k8s/
```

Verify:

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# Monitoring Stack

## Elasticsearch

Stores application and infrastructure logs.

## Kibana

Visualizes logs and dashboards.

## Metricbeat

Collects host and container metrics.

## APM Server

Tracks application performance.

---

# Common Issues

## Kibana Not Accessible

* Verify Elasticsearch is healthy.
* Wait 20–40 seconds after startup.

## Port Already In Use

Check:

```bash
netstat -ano
```

Stop conflicting service or update docker-compose ports.

## Elasticsearch Fails To Start

Allocate at least:

```text
4 GB RAM
```

to Docker Desktop.

## Jenkins Agent Offline

Restart:

```bash
docker compose restart jenkins-agent
```

---

# Recommended Production Resources

| Service            | CPU    | Memory |
| ------------------ | ------ | ------ |
| Jenkins Controller | 2 vCPU | 4 GB   |
| Jenkins Agent      | 2 vCPU | 4 GB   |
| Elasticsearch      | 4 vCPU | 8 GB   |
| Kibana             | 2 vCPU | 2 GB   |
| RabbitMQ           | 2 vCPU | 2 GB   |
| MySQL/PostgreSQL   | 2 vCPU | 4 GB   |
| Redis              | 1 vCPU | 1 GB   |

---

# Project Structure

```text
project-root/
│
├── docker-compose.yml
├── Jenkinsfile
├── k8s/
├── services/
├── infrastructure/
├── monitoring/
├── scripts/
├── assets/
│   └── requirement-diagram.png
│
└── README.md
```

---

# Architecture Diagram

![Architecture Diagram](../assets/requirement-diagram.png)

---

# Version Information

```yaml
Docker: Latest Stable
Docker Compose: v2+
Jenkins: Latest LTS
Kubernetes: v1.30+
AWS EKS: Supported
Minikube: Supported
GitHub Webhooks: Enabled
CI/CD Automation: Enabled
ELK Stack: Enabled
```

