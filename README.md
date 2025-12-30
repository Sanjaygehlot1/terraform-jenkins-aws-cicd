# Issue Tracker – CI/CD Pipeline

## Overview

This project demonstrates a **practical CI/CD pipeline** built to apply my learnings in **Jenkins, Git, Docker, Docker Compose, and Terraform**. AWS is used only as an execution environment; the pipeline design itself is cloud-agnostic.

The focus is on doing CI/CD *the right way*: immutable builds, clean separation of responsibilities, and no infrastructure recreation for application changes.

---

## What This Pipeline Does

* Runs tests for backend and frontend (CI)
* Builds Docker images after tests pass
* Tags images using the Git commit SHA
* Pushes images to a container registry
* Deploys by pulling images on the application server (CD)
* Supports rollback by redeploying a previous image tag

---

## High-Level Flow

1. Code is pushed to Git
2. Jenkins pipeline is triggered
3. Tests run in parallel
4. Docker images are built and tagged with the commit SHA
5. Images are pushed to the registry
6. Jenkins SSHs into the app server
7. The app server pulls images and runs Docker Compose

---

## Project Structure

```
repo/
├── backend/               # Backend service (Node.js)
│   ├── Dockerfile
│   └── source code
├── frontend/              # Frontend service (Vite + Nginx)
│   ├── Dockerfile
│   └── source code
├── docker-compose.yml     # Service orchestration
├── Jenkinsfile            # CI/CD pipeline definition
└── infra/             # Infrastructure provisioning (EC2, IAM, SG)
```

---

## Key Design Decisions

* **Immutable images**: Every build is uniquely tagged (no `latest`)
* **Build vs Run separation**: Jenkins builds images, servers only run them
* **Build-time frontend config**: Vite environment variables are injected during image build
* **Pull-based deployment**: The app server pulls updates; nothing is copied from Jenkins
* **Terraform for infra only**: Infrastructure is created once and reused

---

## Rollback Strategy

If a deployment fails, Jenkins redeploys the images from the previous Git commit. This allows fast rollback without rebuilding or changing infrastructure.

---

## Why This Is Cloud-Agnostic

The same pipeline works with:

* Any Git provider
* Any container registry
* Any VM or on-prem server

Only the execution environment changes, not the CI/CD logic.

---

## Note

This README was written by me and refined with minor AI assistance for clarity and structure.

---

## Summary

This project reflects real-world CI/CD practices rather than a tutorial setup. The emphasis is on correctness, clarity, and maintainability over tooling-specific features.
