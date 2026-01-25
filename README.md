<div align="center">

# 🧘✨ Nirvana Club ✨🧘

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
<img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk">

### *A modern full-stack web application built with React, Node.js, Express, and MongoDB*
### *Featuring seamless Clerk authentication for elegant user management*

---

</div>

## 📑 Table of Contents

- [✨ Features That Shine](#-features-that-shine)
- [🏗️ System Architecture](#️-system-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔧 API Endpoints](#-api-endpoints)
- [📊 Dashboard](#-dashboard)
- [👥 Role Hierarchy System](#-role-hierarchy-system)
- [🔐 Authentication & Data Flow](#-authentication--data-flow)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)
- [📞 Support](#-support)

---

## ✨ **Features That Shine**

<table>
<tr>
<td width="50%">

### 🎨 **Frontend Excellence**
- 🌟 **Modern Landing Page** - Beautiful, responsive design with smooth animations
- 🔐 **Secure Authentication** - Powered by Clerk with Google/GitHub/Email sign-in
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Lightning Fast** - Built with Vite for optimal performance

</td>
<td width="50%">

### 🚀 **Backend Power**
- 🔄 **Real-time Sync** - Automatic synchronization between Clerk and MongoDB
- 👤 **Profile Management** - Edit and update user information seamlessly
- 📊 **Activity Tracking** - View account activity and sync status
- 🛡️ **Enterprise Security** - JWT authentication with proper validation
- 🎭 **Role-Based Access** - Hierarchical role system for permission management

</td>
</tr>
</table>

---

## 🏗️ **System Architecture**

<div align="center">

```mermaid
graph TB
    A[👤 User] --> B[🌐 React Frontend]
    B --> C[🔐 Clerk Auth]
    B --> D[🚀 Express API]
    D --> E[🍃 MongoDB Atlas]
    C --> D
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fce4ec
```

</div>

### 💻 **Tech Stack**

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>React 18 • Vite • Tailwind CSS • Clerk Auth</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Node.js • Express • Mongoose • JWT</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>MongoDB Atlas • Optimized indexing</td>
</tr>
<tr>
<td><strong>Security</strong></td>
<td>CORS • Environment variables • Input validation</td>
</tr>
</table>

## 📁 **Project Structure**

<div align="center">

```
🧘 Nirvana Club/
┣ 📂 frontend/                    ⚛️ React Application
┃ ┣ 📂 src/
┃ ┃ ┣ 📂 components/              🎨 UI Components
┃ ┃ ┃ ┣ 📄 Dashboard.jsx          📊 Multi-tab dashboard
┃ ┃ ┃ ┣ 📄 Hero.jsx               🌟 Landing hero section
┃ ┃ ┃ ┣ 📄 Navbar.jsx             🧭 Navigation component
┃ ┃ ┃ ┣ 📄 Features.jsx           ✨ Features showcase
┃ ┃ ┃ ┣ 📄 Team.jsx               👥 Team section
┃ ┃ ┃ ┣ 📄 Contact.jsx            📧 Contact form
┃ ┃ ┃ ┗ 📄 Footer.jsx             🦶 Footer component
┃ ┃ ┣ 📄 App.jsx                  🏠 Main app component
┃ ┃ ┣ 📄 main.jsx                 🚀 App entry point
┃ ┃ ┗ 📄 index.css                🎨 Global styles
┃ ┣ 📂 public/                    🖼️ Static assets
┃ ┣ 📄 package.json               📦 Dependencies
┃ ┗ 📄 vite.config.js             ⚡ Vite configuration
┣ 📂 backend/                     🟢 Node.js API
┃ ┣ 📂 models/                    🗄️ Database models
┃ ┃ ┗ 📄 User.js                  👤 User schema
┃ ┣ 📂 routes/                    🛣️ API endpoints
┃ ┃ ┗ 📄 users.js                 👥 User management
┃ ┣ 📂 middleware/                🛡️ Custom middleware
┃ ┃ ┣ 📄 errorHandler.js          ❌ Error handling
┃ ┃ ┗ 📄 logger.js                📝 Request logging
┃ ┣ 📂 utils/                     🔧 Utility functions
┃ ┃ ┗ 📄 clerkHelper.js           🔐 Clerk integration
┃ ┣ 📄 index.js                   🚀 Server entry point
┃ ┣ 📄 package.json               📦 Dependencies
┃ ┗ 📄 .env                       🔒 Environment variables
┗ 📄 README.md                    📚 Documentation
```

</div>

## 🚀 **Quick Start Guide**

<div align="center">

### 📋 **Prerequisites**

<table>
<tr>
<td align="center">🟢</td>
<td><strong>Node.js</strong></td>
<td>v18 or higher</td>
</tr>
<tr>
<td align="center">📦</td>
<td><strong>Package Manager</strong></td>
<td>npm or yarn</td>
</tr>
<tr>
<td align="center">🍃</td>
<td><strong>Database</strong></td>
<td>MongoDB Atlas account</td>
</tr>
<tr>
<td align="center">🔐</td>
<td><strong>Authentication</strong></td>
<td>Clerk account</td>
</tr>
</table>

</div>

---

### 🛠️ **Environment Setup**

<details>
<summary><strong>🔧 Step 1: Clone Repository</strong></summary>

```bash
git clone <repository-url>
cd "Nirvana Club/Website"
```

</details>

<details>
<summary><strong>🔒 Step 2: Backend Environment Variables</strong></summary>

Create `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

</details>

<details>
<summary><strong>⚛️ Step 3: Frontend Environment Variables</strong></summary>

Create `.env` file in the `frontend` directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

</details>

---

### 🏃‍♂️ **Installation & Launch**

<table>
<tr>
<td width="50%">

#### 🔧 **Backend Setup**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```
🌐 **Server**: `http://localhost:5000`

</td>
<td width="50%">

#### ⚛️ **Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
🌐 **Application**: `http://localhost:5173`

</td>
</tr>
</table>

## 🔧 API Endpoints

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/refresh` - Refresh user data from Clerk
- `GET /api/users/all` - Get all users (authenticated)
- `GET /api/health` - Health check endpoint

### Authentication
All user endpoints require Clerk JWT authentication via `Authorization: Bearer <token>` header.

## 📊 **Dashboard**

**Overview** • **Profile Management** • **Settings** • **Activity Tracking**

Multi-tab interface with real-time data sync, profile editing, and comprehensive user management.

## 👥 **Role Hierarchy System**

Nirvana Club implements a hierarchical role-based access control (RBAC) system to manage user permissions and privileges:

```mermaid
graph TD
    A[🔴 SUPER_ADMIN] --> B[🟠 LEAD]
    B --> C[🟡 CO_LEAD]
    C --> D[🟢 DOMAIN_LEAD]
    D --> E[🔵 MEMBER]
    
    style A fill:#dc2626,color:#fff
    style B fill:#ff6b6b,color:#fff
    style C fill:#ff8787,color:#fff
    style D fill:#ffa94d,color:#000
    style E fill:#94a3b8,color:#fff
```

### Role Descriptions

| Role            | Level | Description                               | Key Permissions                                  |
| --------------- | ----- | ----------------------------------------- | ------------------------------------------------ |
| **SUPER_ADMIN** | 5     | Highest authority with full system access | All permissions, can promote to any role         |
| **LEAD**        | 4     | Primary leadership role                   | User management, can promote up to LEAD          |
| **CO_LEAD**     | 3     | Secondary leadership role                 | Similar to LEAD, can promote up to CO_LEAD       |
| **DOMAIN_LEAD** | 2     | Domain-specific leadership                | Domain management, can promote up to DOMAIN_LEAD |
| **MEMBER**      | 1     | Default user role                         | Basic access, view and interact                  |

### Promotion Rules

- Users can promote others **up to their own role level**
- New users are assigned the **MEMBER** role by default
- Role changes are logged for security and audit purposes
- Higher roles inherit all permissions from lower roles

## 🔐 **Authentication & Data Flow**

**Landing Page** → **Clerk Auth** → **Dashboard** → **MongoDB Sync** → **Role Assignment**

1. **Authentication**: Choose Google, GitHub, or Email via Clerk
2. **Dashboard Access**: Automatic redirect after successful login
3. **Data Sync**: Creates/updates MongoDB user record with Clerk data
4. **Role Assignment**: New users automatically assigned MEMBER role
5. **Profile Management**: Real-time sync between Clerk and MongoDB
6. **Fallback Handling**: Graceful handling of incomplete data

## 🧪 **Testing**

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] User registration with email
- [ ] User login with Google OAuth
- [ ] User login with GitHub OAuth
- [ ] Profile data sync between Clerk and MongoDB
- [ ] Profile editing and updates
- [ ] Role-based access control
- [ ] Dashboard navigation
- [ ] API endpoint authentication
- [ ] Error handling and validation

---

## 🐛 **Troubleshooting**

### Common Issues

<details>
<summary><strong>❌ CORS Errors</strong></summary>

**Problem:** Frontend cannot connect to backend

**Solution:**
```javascript
// backend/index.js
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```
</details>

<details>
<summary><strong>❌ MongoDB Connection Failed</strong></summary>

**Problem:** Cannot connect to MongoDB Atlas

**Solutions:**
1. Check if IP is whitelisted in MongoDB Atlas
2. Verify connection string format
3. Ensure database user has correct permissions
4. Check network connectivity
</details>

<details>
<summary><strong>❌ Clerk Authentication Not Working</strong></summary>

**Problem:** Users cannot sign in

**Solutions:**
1. Verify Clerk API keys are correct
2. Check if domain is added to Clerk dashboard
3. Ensure `VITE_CLERK_PUBLISHABLE_KEY` matches backend key
4. Clear browser cache and cookies
</details>

<details>
<summary><strong>❌ Build Errors</strong></summary>

**Problem:** `npm run build` fails

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check Node.js version (requires v18+)
4. Clear npm cache: `npm cache clean --force`
</details>

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Website.git
   cd Website
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation if needed

5. **Test Your Changes**
   ```bash
   # Run tests
   npm test
   
   # Test manually
   npm run dev
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

7. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Submit for review

### Code Style Guidelines

- Use **ES6+** syntax
- Follow **Airbnb JavaScript Style Guide**
- Use **meaningful variable names**
- Keep functions **small and focused**
- Add **JSDoc comments** for functions
- Use **async/await** over promises

### Pull Request Guidelines

- Provide a clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature/fix

---

## 📄 **License**

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2026 Nirvana Club

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---


## 👥 Team

Built with ❤️ by the Nirvana Club development team.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚀**