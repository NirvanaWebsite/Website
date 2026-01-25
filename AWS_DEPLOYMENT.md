# AWS EC2 Deployment Guide

This guide will help you deploy the Nirvana Club application on AWS EC2.

## Prerequisites

- AWS Account with EC2 access
- SSH key pair for EC2 instance
- Domain name (optional, but recommended)

## Step 1: Launch EC2 Instance

1. **Choose AMI**: Ubuntu Server 22.04 LTS (or similar)
2. **Instance Type**: t2.small or larger (t2.micro may be too limited)
3. **Security Group**: Configure the following inbound rules:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere (0.0.0.0/0)
   - HTTPS (443) - Anywhere (0.0.0.0/0)
   - Custom TCP (5000) - Anywhere (for backend API)
   - Custom TCP (5173) - Anywhere (for frontend dev server, or use 80/443 for production)

## Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Verify installations
node --version
npm --version
git --version
```

## Step 4: Clone and Setup Application

```bash
# Clone your repository
git clone <your-repository-url>
cd "Nirvana Club/Website"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 5: Configure Environment Variables

### Backend Configuration

Create/update `backend/.env`:

```bash
cd ~/Nirvana\ Club/Website/backend
nano .env
```

Add the following (replace with your actual values):

```env
# Server Configuration
PORT=5000

# Database Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Frontend URL for CORS
# Use your EC2 public IP or domain
FRONTEND_URL=http://your-ec2-public-ip:5173

# Environment
NODE_ENV=production
```

### Frontend Configuration

Create/update `frontend/.env`:

```bash
cd ~/Nirvana\ Club/Website/frontend
nano .env
```

Add the following:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API URL
# Use your EC2 public IP or domain
VITE_API_URL=http://your-ec2-public-ip:5000
```

## Step 6: Start Backend with PM2

```bash
cd ~/Nirvana\ Club/Website/backend
pm2 start index.js --name nirvana-backend
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable auto-start on reboot.

## Step 7: Build and Serve Frontend

### Option A: Development Server (Quick Test)

```bash
cd ~/Nirvana\ Club/Website/frontend
pm2 start "npm run dev" --name nirvana-frontend
pm2 save
```

### Option B: Production Build (Recommended)

```bash
cd ~/Nirvana\ Club/Website/frontend
npm run build

# Install serve globally
sudo npm install -g serve

# Serve the built files
pm2 start "serve -s dist -l 5173" --name nirvana-frontend
pm2 save
```

## Step 8: Configure Nginx (Optional but Recommended)

For production, use Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/nirvana
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/nirvana /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Update your environment variables to use port 80:
- `FRONTEND_URL=http://your-domain.com`
- `VITE_API_URL=http://your-domain.com`

Restart services:

```bash
pm2 restart all
```

## Step 9: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

Update environment variables to use HTTPS:
- `FRONTEND_URL=https://your-domain.com`
- `VITE_API_URL=https://your-domain.com`

## Useful PM2 Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs nirvana-backend
pm2 logs nirvana-frontend

# Restart services
pm2 restart nirvana-backend
pm2 restart nirvana-frontend
pm2 restart all

# Stop services
pm2 stop nirvana-backend
pm2 stop nirvana-frontend

# Delete services
pm2 delete nirvana-backend
pm2 delete nirvana-frontend
```

## Updating Your Application

```bash
# Pull latest changes
cd ~/Nirvana\ Club/Website
git pull

# Update backend
cd backend
npm install
pm2 restart nirvana-backend

# Update frontend
cd ../frontend
npm install
npm run build  # if using production build
pm2 restart nirvana-frontend
```

## Troubleshooting

### Backend not accessible
- Check if backend is running: `pm2 list`
- Check logs: `pm2 logs nirvana-backend`
- Verify MongoDB connection string
- Check security group allows port 5000

### Frontend not accessible
- Check if frontend is running: `pm2 list`
- Check logs: `pm2 logs nirvana-frontend`
- Verify `VITE_API_URL` is correct
- Check security group allows port 5173 (or 80/443)

### CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart backend after changing environment variables

### Authentication not working
- Verify Clerk keys are correct
- Check that both frontend and backend have matching Clerk publishable key
- Ensure Clerk dashboard has your domain/IP whitelisted

## Security Recommendations

1. **Use environment-specific keys**: Don't use test keys in production
2. **Restrict SSH access**: Only allow your IP in security group
3. **Use HTTPS**: Always use SSL certificates for production
4. **Regular updates**: Keep system and dependencies updated
5. **Firewall**: Consider using UFW for additional security
6. **Monitoring**: Set up CloudWatch or similar monitoring
7. **Backups**: Regular database backups

## Cost Optimization

- Use t2.micro for testing (free tier eligible)
- Stop instance when not in use
- Use Elastic IP to maintain same IP address
- Consider using AWS Lightsail for simpler pricing
