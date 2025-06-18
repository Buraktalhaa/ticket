# 🎫 Ticket Management System

A modern full-stack ticket management application with role-based access control, real-time features, and comprehensive user authentication.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication system
- 👥 Role-based access control (User/Admin)
- 🔒 Secure password hashing
- 📱 Session management

### Ticket Management
- 📝 Create, read, update, and delete tickets
- 🏷️ Ticket categorization and priority levels
- 📊 Ticket status tracking
- 🔍 Advanced search and filtering

### User Interface
- 💻 Responsive Angular frontend
- 🎨 Modern, intuitive UI/UX
- ⚡ Real-time updates
- 📱 Mobile-friendly design

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Caching:** Redis

### Frontend
- **Framework:** Angular
- **Language:** TypeScript
- **Styling:** CSS3

### DevOps & Tools
- **Containerization:** Docker
- **Version Control:** Git
- **Package Manager:** npm
- **API Testing:** REST Client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Buraktalhaa/ticket.git
cd ticket
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp example.env .env

# Edit the .env file with your configuration
nano .env
```

### 3. Run with Docker
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### 4. Manual Installation (Alternative)
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run database migrations
cd ../backend
npx prisma migrate deploy
npx prisma generate

# Start backend server
npm run dev

# In another terminal, start frontend
cd ../frontend
ng serve
```

## 🔧 Usage

**Access the Application:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Burak Talha**
- GitHub: [@Buraktalhaa](https://github.com/Buraktalhaa)
- LinkedIn: [Your LinkedIn Profile](www.linkedin.com/in/buraktalhamemis)

## 🙏 Acknowledgments

- Thanks to all contributors who helped improve this project
- Special thanks to the open-source community
- Inspired by modern ticket management systems

---

⭐ If you found this project helpful, please give it a star on GitHub!