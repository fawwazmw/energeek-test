# 🚀 Production Deployment Guide

## Prerequisites

- Docker & Docker Compose installed on your server
- Domain name (optional, but recommended)
- Server with at least 2GB RAM, 2 CPU cores, 20GB storage

---

## 📋 Quick Start (Production)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Configure Environment Variables

```bash
# Copy the production environment template
cp .env.production.example .env

# Edit the file and set your values
nano .env
```

**Required changes in `.env`:**
```env
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_URL=https://yourdomain.com
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
```

### 3. Generate Application Key

```bash
# Generate Laravel app key
docker-compose -f docker-compose.prod.yml run --rm backend php artisan key:generate --show

# Copy the output and paste it into .env as APP_KEY
```

### 4. Build and Start Services

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services in detached mode
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Verify Deployment

```bash
# Check if all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test the application
curl http://localhost/health
```

**Your app is now running!**
- Frontend: http://localhost (or your domain)
- API: http://localhost/api

---

## 🔐 Default Credentials

- **Email:** admin@energeek.co.id
- **Password:** password

**⚠️ IMPORTANT:** Change the admin password after first login!

---

## 🔧 Common Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Run Artisan Commands
```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan <command>

# Examples:
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate
docker-compose -f docker-compose.prod.yml exec backend php artisan cache:clear
docker-compose -f docker-compose.prod.yml exec backend php artisan config:cache
```

### Access Database
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d energeek_db
```

### Database Backup
```bash
# Backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres energeek_db > backup_$(date +%Y%m%d).sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres energeek_db < backup_20261231.sql
```

---

## 🌐 Domain Setup (Optional but Recommended)

### Option 1: Using Caddy (Easiest - Auto HTTPS)

1. Install Caddy on your server:
```bash
sudo apt install -y caddy
```

2. Create `/etc/caddy/Caddyfile`:
```caddyfile
yourdomain.com {
    reverse_proxy localhost:80
}
```

3. Restart Caddy:
```bash
sudo systemctl restart caddy
```

**Done! Caddy automatically gets SSL certificate from Let's Encrypt.**

### Option 2: Using Nginx + Certbot

1. Install Nginx and Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

2. Create `/etc/nginx/sites-available/energeek`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Enable site and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/energeek /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring

### Health Checks

```bash
# Nginx health
curl http://localhost/health

# Backend API health
curl http://localhost/api/health

# Check all container status
docker-compose -f docker-compose.prod.yml ps
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Common issues:
# - Database not ready: Wait 30 seconds and check again
# - Permission errors: Check file permissions
# - Port conflicts: Make sure ports 80, 8000 are not in use
```

### Database connection failed
```bash
# Verify database is running
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check credentials in .env
docker-compose -f docker-compose.prod.yml exec backend env | grep DB_
```

### Clear all caches
```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan cache:clear
docker-compose -f docker-compose.prod.yml exec backend php artisan config:clear
docker-compose -f docker-compose.prod.yml exec backend php artisan route:clear
docker-compose -f docker-compose.prod.yml exec backend php artisan view:clear
```

### Frontend shows 404 on refresh
This is already handled in the nginx configuration. If you still face issues:
```bash
# Rebuild frontend
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Set strong `DB_PASSWORD` in `.env`
- [ ] Generated unique `APP_KEY`
- [ ] Set `APP_DEBUG=false`
- [ ] Configured firewall (allow only ports 80, 443, 22)
- [ ] Using HTTPS (via Caddy or Certbot)
- [ ] Regular backups scheduled
- [ ] Updated `APP_URL` to your domain

---

## 🎯 Platform-Specific Deployments

### Deploy to DigitalOcean

1. Create a Droplet (Ubuntu 22.04, minimum $6/month plan)
2. SSH into your droplet
3. Install Docker:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
4. Follow the "Quick Start" steps above

### Deploy to Railway.app

Railway auto-detects Docker configuration:

1. Connect your GitHub repo
2. Add PostgreSQL service
3. Set environment variables in Railway dashboard
4. Deploy automatically on push!

### Deploy to AWS EC2

1. Launch EC2 instance (t3.small minimum)
2. Configure security group (allow 80, 443, 22)
3. SSH and install Docker
4. Follow "Quick Start" steps
5. (Optional) Use RDS for PostgreSQL instead of container

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify environment variables: Check `.env` file
3. Check container health: `docker-compose -f docker-compose.prod.yml ps`
4. Review this guide's troubleshooting section

---

## 📝 Notes

- **Persistent Data:** PostgreSQL data is stored in Docker volume `postgres_data`
- **Backups:** Set up automated backups for the database
- **Updates:** Run `git pull && docker-compose -f docker-compose.prod.yml up -d --build`
- **Scaling:** For high traffic, consider using managed database (AWS RDS, DigitalOcean Managed DB)

---

**🎉 Congratulations! Your application is now running in production.**
