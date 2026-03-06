# 📚 API Documentation

## 🌐 Access Documentation

Your API now has **interactive Swagger UI documentation**!

### Development
```
http://localhost:8000/api-docs
http://localhost:8000/docs
```

### Docker
```
http://localhost/api-docs
http://localhost/docs
```

### Production
```
https://yourdomain.com/api-docs
```

---

## 🚀 Quick Start

1. **Start your backend**
   ```bash
   cd energeek-be
   php artisan serve
   ```

2. **Open browser**
   ```
   http://localhost:8000/api-docs
   ```

3. **Authenticate**
   - Click **POST /api/login**
   - Click **"Try it out"**
   - Use credentials:
     ```json
     {
       "email": "admin@energeek.co.id",
       "password": "password"
     }
     ```
   - Copy the token from response
   - Click **"Authorize"** button (top right)
   - Enter: `Bearer <your-token>`
   - Click **"Authorize"** then **"Close"**

4. **Test any endpoint**
   - Now you can test all protected endpoints!

---

## 📖 Available Endpoints

### Authentication
- `POST /api/login` - Login and get access token
- `POST /api/logout` - Logout (revoke token)
- `GET /api/user` - Get current user details

### Projects
- `GET /api/projects` - List all projects
  - Query params: `search`, `status` (active/archived)
- `POST /api/projects` - Create new project
- `GET /api/projects/{slug}` - Get project with tasks
- `PUT /api/projects/{slug}` - Update project

### Tasks
- `GET /api/tasks` - List all tasks
  - Query params: `search`, `project_id`, `category_id`
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task (move categories)
- `DELETE /api/tasks/{id}` - Delete task (soft delete)

### Dashboard
- `GET /api/dashboard` - Get statistics and upcoming tasks

### Categories
- `GET /api/categories` - List all categories (Todo, In Progress, Done)

---

## 🎯 Features

✨ **Interactive Testing** - Try out endpoints directly in browser  
✨ **Bearer Token Auth** - Persistent authentication  
✨ **Request/Response Examples** - See all parameters and responses  
✨ **Schema Definitions** - Complete data models  
✨ **Search & Filter** - Find endpoints quickly  
✨ **Export** - Download as JSON for Postman/Insomnia  

---

## 📝 Using with Postman

1. Export OpenAPI spec:
   ```
   http://localhost:8000/api-docs.json
   ```

2. In Postman:
   - File → Import
   - Paste the URL above
   - Click Import

3. Set up authorization:
   - Collection → Authorization
   - Type: Bearer Token
   - Token: `<your-token-from-login>`

---

## 🔧 Updating Documentation

The API documentation is in `energeek-be/public/api-docs.json`

To update:
1. Edit `api-docs.json`
2. Refresh browser (no build needed!)

---

## 📦 Production Deployment

The API docs are included in production Docker setup:

```bash
# Access in production
docker-compose -f docker-compose.prod.yml up -d

# Visit
http://yourdomain.com/api-docs
```

Files are served from `energeek-be/public/`:
- `api-docs.json` - OpenAPI 3.0 specification
- `api-docs.html` - Swagger UI interface
- `swagger-ui-*.js` - Swagger UI assets
- `swagger-ui.css` - Swagger UI styles

---

## 🎨 Customization

### Update API Info
Edit `api-docs.json`:
```json
{
  "info": {
    "title": "Your API Title",
    "description": "Your description",
    "version": "2.0.0"
  }
}
```

### Update Server URLs
```json
{
  "servers": [
    {
      "url": "https://api.yourdomain.com",
      "description": "Production"
    }
  ]
}
```

### Customize UI
Edit `api-docs.html` to change Swagger UI configuration.

---

## 🐛 Troubleshooting

### Documentation not loading
- Check if backend is running: `php artisan serve`
- Verify files exist in `energeek-be/public/`
- Check browser console for errors

### 401 Unauthorized errors
- Make sure you're authenticated (click "Authorize")
- Token format: `Bearer <token>` (with space)
- Token expires - re-login if needed

### CORS errors
- Check `config/cors.php` settings
- Ensure `'paths' => ['api/*']` is set

---

## 💡 Tips

- Use **"Try it out"** to test APIs without writing code
- **Schemas** section shows all data structures
- **Responses** tab shows example responses
- **Authorization persists** across page refreshes
- Share documentation URL with frontend developers

---

Enjoy your professional API documentation! 📚✨
