# The Abyss Team Website

Modern, responsive website for The Abyss Development Team showcasing our projects, mission, team members, and services.

## 🚀 Deployment

This project is configured for deployment on Railway.

### Deploy to Railway

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push
   ```

2. **Deploy on Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository
   - Railway will automatically detect the configuration and deploy

3. **Environment Variables**
   - No environment variables needed for basic deployment
   - Railway automatically assigns a PORT variable

### Local Development

Run locally with Python:
```bash
python server.py
```

The site will be available at `http://localhost:8080`

## 📁 Project Structure

```
theabyssdevteam/
├── index.html          # Home page
├── mission.html        # Mission & values
├── discoveries.html    # Projects showcase
├── team.html          # Team members
├── contact.html       # Contact information
├── css/
│   └── style.css      # Main stylesheet
├── scripts/
│   └── features.js    # Interactive features
├── images/            # Image assets
├── server.py          # Python HTTP server
├── railway.toml       # Railway configuration
└── requirements.txt   # Python dependencies
```

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)
- Python 3.11 (for serving)

## 📦 Features

- Modern, responsive design
- Interactive project showcase
- Team member profiles
- Animated UI elements
- Contact forms and social links
- Dark theme with cyan accents

## 🔧 Configuration

The site is configured to run on Railway with:
- Python 3.11
- Auto-restart on failure
- Dynamic PORT assignment

## 📞 Contact

- Email: raulpereiraleitee@gmail.com
- Discord: [Join our server](https://discord.gg/meGs9QPbZd)
- Form: [Contact Form](https://forms.gle/uGt9hcVHUPL6BNFg9)

## 📄 License

© 2026 The Abyss Development Team. All rights reserved.
