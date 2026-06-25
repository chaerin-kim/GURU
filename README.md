# GURU

This repository contains both the frontend and backend projects.

- Frontend: `guru`
- Backend: `guru_server`

## Deploy

Deploy the frontend from `guru` and the backend from `guru_server`.

Set frontend environment variables:

```env
REACT_APP_API_URL=https://your-cloudtype-backend-url
```

Set backend environment variables:

```env
PORT=8000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
```
