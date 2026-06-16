# Jobber K8S Service - Low Level Design (LLD)

## Overview

Jobber Service is a containerized microservice deployed on Kubernetes for processing background jobs, scheduled tasks, and asynchronous workloads.

The service supports deployment on:

- AWS EKS (Production/Staging)
- Minikube (Local Development)

---

# Architecture

## AWS Deployment Architecture

┌─────────────────┐
│ Route53 / ALB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AWS EKS Cluster │
└────────┬────────┘
         │
 ┌───────┴─────────┐
 │                 │
 ▼                 ▼
Jobber Pods     Redis
Deployment      Cache

         │
         ▼

      MySQL/RDS

         │
         ▼

     AWS S3

---

## Minikube Deployment Architecture

┌──────────────┐
│   Minikube   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Jobber Pod   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Redis Pod    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Local MySQL  │
└──────────────┘

---

# Components

## 1. Jobber Application

Responsibilities:

- Process background jobs
- Handle queue consumers
- Execute scheduled tasks
- Generate reports
- Send notifications

Container Port:

```yaml
3000
```

---

## 2. Redis

Purpose:

- Queue management
- Job storage
- Caching

Port:

```yaml
6379
```

---

## 3. Database

AWS:

```yaml
Amazon RDS MySQL
```

Local:

```yaml
MySQL Container
```

Port:

```yaml
3306
```

---

# Kubernetes Resources

## Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: jobber
```

---

## ConfigMap

Stores non-sensitive configuration.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jobber-config
data:
  NODE_ENV: production
  PORT: "3000"
```

---

## Secret

Stores sensitive configuration.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: jobber-secret
type: Opaque
data:
  DB_PASSWORD: base64-value
```

---

## Deployment

### Jobber Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jobber
spec:
  replicas: 2
  selector:
    matchLabels:
      app: jobber
  template:
    metadata:
      labels:
        app: jobber
    spec:
      containers:
        - name: jobber
          image: jobber:latest
          ports:
            - containerPort: 3000
```

---

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jobber-service
spec:
  selector:
    app: jobber
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

---

## Ingress

AWS ALB Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jobber-ingress
spec:
  ingressClassName: alb
```

Minikube Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jobber-ingress
spec:
  ingressClassName: nginx
```

---

# Scaling Strategy

Horizontal Pod Autoscaler:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: jobber-hpa
spec:
  minReplicas: 2
  maxReplicas: 10
```

Scaling Metrics:

- CPU Utilization
- Memory Utilization
- Queue Length

---

# Logging

Container Logs:

```bash
kubectl logs <pod-name>
```

AWS:

- CloudWatch Logs

Local:

- Kubectl Logs

---

# Monitoring

AWS:

- CloudWatch
- Prometheus
- Grafana

Minikube:

- Prometheus
- Grafana

---

# Health Checks

Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
```

Readiness Probe

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
```

---

# AWS Infrastructure

## EKS Cluster

```yaml
Cluster Name:
jobber-eks
```

## Node Group

```yaml
Instance Type:
t3.medium
```

## RDS

```yaml
Engine:
MySQL 8.0
```

## S3 Bucket

```yaml
jobber-files-prod
```

## ECR Repository

```yaml
jobber-service
```

---

# Minikube Setup

Start Cluster

```bash
minikube start
```

Enable Ingress

```bash
minikube addons enable ingress
```

Deploy Resources

```bash
kubectl apply -f k8s/
```

Verify Pods

```bash
kubectl get pods -n jobber
```

Verify Services

```bash
kubectl get svc -n jobber
```

---

# AWS Deployment Steps

Login to ECR

```bash
aws ecr get-login-password \
| docker login \
--username AWS \
--password-stdin <account>.dkr.ecr.<region>.amazonaws.com
```

Build Image

```bash
docker build -t jobber .
```

Tag Image

```bash
docker tag jobber:latest \
<account>.dkr.ecr.<region>.amazonaws.com/jobber:latest
```

Push Image

```bash
docker push \
<account>.dkr.ecr.<region>.amazonaws.com/jobber:latest
```

Deploy

```bash
kubectl apply -f k8s/
```

---

# CI/CD Flow

Git Push
    │
    ▼
GitLab / GitHub Actions
    │
    ▼
Docker Build
    │
    ▼
Push to ECR
    │
    ▼
Deploy to EKS
    │
    ▼
Health Validation

---

# Security

- Kubernetes Secrets
- IAM Roles for Service Accounts (IRSA)
- TLS Enabled
- Network Policies
- Security Groups
- RBAC

---

# Disaster Recovery

Backup Components:

- MySQL Database
- Redis Snapshots
- Kubernetes Manifests
- S3 Objects

Recovery Objective:

```yaml
RPO: 15 Minutes
RTO: 30 Minutes
```

---

# Folder Structure

```text
jobber-k8s/
│
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
│
├── Dockerfile
├── .env
└── README.md
```

---

# Version

```yaml
Version: 1.0.0
Environment:
  - Local (Minikube)
  - Staging (EKS)
  - Production (EKS)
```