# Intelligent Security Assistant for Craft Sector SMEs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A web-based intelligent security assistant developed as part of the "Intelligent Security Handwerk" research project. This application is designed to help small and medium-sized enterprises (SMEs) in the German craft sector assess and improve their IT security, even with limited IT expertise.

This repository contains the source code for both the **backend** (Java/Spring Boot) and the **frontend** (Next.js) components.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started (Production-like Setup)](#getting-started-production-like-setup)
  - [Prerequisites](#prerequisites)
  - [Installation & Configuration](#installation--configuration)
  - [Setting up SSL with Let's Encrypt](#setting-up-ssl-with-lets-encrypt)
- [Local Development Setup](#local-development-setup)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **IT Asset Management**: Systematically inventory your company's hardware and software components.
- **Security Measure Tracking**: Document implemented IT security measures based on standards like the BSI IT-Grundschutz.
- **Automated Security Assessment**: Receive a calculated security score and a clear evaluation of your current security posture.
- **Personalized Recommendations**: Get concrete, prioritized, and easy-to-understand recommendations for action.
- **Knowledge Base**: Access a glossary and helpful articles to build your IT security competence.
- **Provider Search**: Find external service providers for support and training.

## Tech Stack

- **Backend**:
  - Java 17
  - Spring Boot 3
  - Spring Data JPA / Hibernate
  - Spring Security (JWT Authentication)
  - MariaDB (Production) / H2 (Development)
  - Flyway (Database Migrations)
  - Gradle
- **Frontend**:
  - Next.js
  - TypeScript
- **Infrastructure & Deployment**:
  - Docker & Docker Compose
  - Nginx (as a reverse proxy)
  - Certbot (for SSL certificate management)

## Getting Started (Production-like Setup)

These instructions will get you a copy of the project up and running on a server for production-like use. This setup includes generating a valid SSL certificate with Let's Encrypt.

### Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- A domain name pointing to your server's public IP address.

### Installation & Configuration

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KITcii/Intelligent-Security-Handwerk.git
    cd Intelligent-Security-Handwerk
    ```

2.  **Create the environment file:**
    Copy the example file and customize the values. This file stores all your configuration variables.
    ```bash
    cp .env.example .env
    ```
    Now, open `.env` in an editor and adjust variables like `DB_PASSWORD`, `JWT_SECRET`, and `YOUR_DOMAIN`.

3.  **Generate necessary secrets:**
    -   **DHPARAM for Nginx:**
        ```bash
        sudo openssl dhparam -out .docker/secrets/dhparam.pem 2048
        ```
    -   **Authentication Key for Next.js:**
        ```bash
        openssl rand -base64 32 > .docker/secrets/nextauth_secret.key
        ```

4.  **Build and start the services:**
    This will build the Docker images and start all services (backend, frontend, database, nginx) in the background. Initially, this will use self-signed "snakeoil" certificates.
    ```bash
    docker compose build
    docker compose up -d
    ```

### Setting up SSL with Let's Encrypt

After the initial startup, follow these steps to replace the self-signed certificates with valid ones from Let's Encrypt.

1.  **Ensure `CERT_PATH_CONTAINER` is set for the test run.**
    In your `.env` file, make sure the following line is set:
    ```
    CERT_PATH_CONTAINER=/etc/nginx/ssl/snakeoil
    ```

2.  **Perform a dry run with Certbot:**
    This command tests the certificate generation process without actually issuing a certificate. Replace `YOUR_DOMAIN` with your real domain name.
    ```bash
    sudo docker compose run --rm -it --entrypoint 'certbot certonly --webroot --webroot-path /var/www/certbot --post-hook /etc/letsencrypt/renewal-hooks/deploy/update_permissions.sh --dry-run -v -d YOUR_DOMAIN' certbot
    ```

3.  **Generate the real SSL certificate:**
    If the dry run was successful, run the command again without the `--dry-run` flag:
    ```bash
    sudo docker compose run --rm -it --entrypoint 'certbot certonly --webroot --webroot-path /var/www/certbot --post-hook /etc/letsencrypt/renewal-hooks/deploy/update_permissions.sh -v -d YOUR_DOMAIN' certbot
    ```

4.  **Update the `.env` file:**
    Change `CERT_PATH_CONTAINER` to point to the new Let's Encrypt certificate path. Replace `YOUR_DOMAIN` accordingly.
    ```
    CERT_PATH_CONTAINER=/etc/nginx/ssl/letsencrypt/live/YOUR_DOMAIN
    ```

5.  **Restart the services:**
    Apply the configuration changes by restarting your Docker containers.
    ```bash
    docker compose down
    docker compose up -d
    ```
    Your application should now be available at `https://YOUR_DOMAIN` with a valid SSL certificate.

## Local Development Setup

These instructions are for setting up a local development environment.

1.  **Follow initial setup:**
    Complete steps 1-3 from the [Installation & Configuration](#installation--configuration) section above.

2.  **Create the development environment file:**
    Copy the development example file. This configures services like the backend to use an in-memory H2 database.
    ```bash
    cp .env.dev.example .env
    ```
    Feel free to customize the values in the new `.env` file if needed.

3.  **Build and start the services:**
    ```bash
    docker compose build
    docker compose up
    ```
    The `up` command will run the services in the foreground and show logs from all containers.

4.  **Access the services:**
    The application will be available at the following local URLs:
    -   **Frontend**: `https://localhost/` (You will need to accept the self-signed certificate warning in your browser).
    -   **Backend API**: `https://localhost:8989/`
    -   **H2 Database Console**: `http://localhost:8989/h2-ui` (as configured in `application-development.yml`)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This work was developed as part of the **"Intelligent Security Handwerk"** project at the **AIFB Institute, Karlsruhe Institute of Technology (KIT)**. The project was funded by the German Federal Ministry for Economic Affairs and Climate Action (BMWi) as part of the "IT-Sicherheit in der Wirtschaft" program.