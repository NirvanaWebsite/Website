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

## 🚀 **Deployment**

**Frontend** (Netlify/Vercel) • **Backend** (Railway/Heroku) • **Database** (MongoDB Atlas)

1. Build frontend: `npm run build`
2. Set environment variables on platforms
3. Deploy with automatic builds and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request


## 👥 Team

Built with ❤️ by the Nirvana Club development team.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚀**