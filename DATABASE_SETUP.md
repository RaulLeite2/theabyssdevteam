# 🗄️ Database Configuration Guide

## Overview

This application supports **two flexible methods** for PostgreSQL database configuration. The system automatically detects which method to use based on available environment variables.

---

## 🎯 Configuration Methods

### **Method 1: DATABASE_URL (Recommended)**

✅ **Priority: HIGHEST**  
✅ **Best for:** Railway, Heroku, Docker, Production  
✅ **Simplicity:** Single variable

#### Format:
```bash
DATABASE_URL=postgresql://username:password@hostname:port/database
```

#### Example:
```bash
DATABASE_URL=postgresql://postgres:secretpass@db.example.com:5432/myapp
```

#### Where to get this:
- **Railway**: Auto-generated when you add PostgreSQL service
- **Heroku**: Available in Config Vars after adding Heroku Postgres
- **Docker**: Set in `docker-compose.yml` or `.env`
- **Local**: Connection string from your local PostgreSQL

---

### **Method 2: Separate Variables (Alternative)**

✅ **Priority: FALLBACK**  
✅ **Best for:** Legacy systems, custom setups  
✅ **Flexibility:** Individual control over each parameter

#### Required Variables:
```bash
PGHOST=hostname          # Database server hostname
PGPORT=5432             # Database port (default: 5432)
PGUSER=username         # Database user
PGPASSWORD=password     # Database password
PGDATABASE=database     # Database name
```

#### Example:
```bash
PGHOST=localhost
PGPORT=5432
PGUSER=myuser
PGPASSWORD=mypassword
PGDATABASE=myapp_production
```

---

## 🔄 Priority Logic

The system follows this decision tree:

```
1. Check if DATABASE_URL exists
   ├─ YES → Use DATABASE_URL (ignore PG* variables)
   └─ NO  → Check PG* variables
          ├─ ALL present → Use PG* variables
          └─ MISSING → Show error with detailed instructions
```

---

## 🚀 Platform-Specific Setup

### **Railway**

1. Go to your Railway project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates `DATABASE_URL`
4. Deploy your app - it will auto-connect!

**Railway Features:**
- ✅ Automatic `DATABASE_URL` injection
- ✅ Private networking (fast, secure)
- ✅ Automatic backups
- ✅ Connection pooling support

---

### **Heroku**

1. Run: `heroku addons:create heroku-postgresql:mini`
2. Heroku creates `DATABASE_URL` automatically
3. Deploy: `git push heroku main`

---

### **Docker / Docker Compose**

**Option A: docker-compose.yml**
```yaml
version: '3.8'
services:
  app:
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mydb
  
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
```

**Option B: .env file**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

---

### **Local Development**

#### Using DATABASE_URL:
```bash
# Create .env file
DATABASE_URL=postgresql://postgres:mypass@localhost:5432/theabyss_dev
NODE_ENV=development
PORT=3000
```

#### Using PG* variables:
```bash
# Create .env file
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=mypass
PGDATABASE=theabyss_dev
NODE_ENV=development
PORT=3000
```

---

## 🛡️ Security Features

### Password Masking in Logs
The system **never logs full passwords**. Instead, it shows:

```
✅ Password: se**************rd  (masked)
```

Only the first 2 and last 2 characters are visible.

### SSL/TLS
- **Production**: SSL automatically enabled (`{ rejectUnauthorized: false }`)
- **Development**: SSL disabled for localhost

---

## 🧪 Testing Connection

### Quick Test:
```bash
# Run the server
npm start

# Look for these logs:
✅ METHOD: DATABASE_URL detected
📊 Parsed Database Configuration:
   User: postgres
   Password: se**************rd
   Host: db.example.com
   Port: 5432
   Database: myapp

✅✅✅ DATABASE INITIALIZATION SUCCESSFUL ✅✅✅
```

### Manual Test (psql):
```bash
# Using DATABASE_URL
psql "postgresql://user:pass@host:5432/db"

# Using separate variables
psql -h localhost -p 5432 -U myuser -d mydb
```

---

## ❌ Troubleshooting

### Error: "Missing required database configuration"

**Cause:** Neither `DATABASE_URL` nor all `PG*` variables are set.

**Solution:**
1. Choose Method 1 or Method 2 (see above)
2. Set the required variables
3. Restart the application

---

### Error: "Connection timeout"

**Possible causes:**
- Wrong hostname/port
- Firewall blocking connection
- Database not running

**Solutions:**
1. Verify host and port are correct
2. Check if database is accessible: `telnet hostname port`
3. For Railway: Ensure both services are in the same project
4. Check firewall rules

---

### Error: "Authentication failed"

**Cause:** Wrong username or password.

**Solution:**
1. Double-check credentials
2. Verify no extra spaces in `.env` file
3. For Railway: Copy `DATABASE_URL` from PostgreSQL service settings

---

### Error: "Database does not exist"

**Cause:** Database name is wrong or database not created.

**Solution:**
```bash
# Connect to PostgreSQL
psql -h hostname -U username -d postgres

# Create database
CREATE DATABASE your_database_name;
```

---

## 📊 Connection Pool Settings

The application uses these optimized settings:

| Setting | Value | Purpose |
|---------|-------|---------|
| Max Connections | 20 | Maximum concurrent clients |
| Min Connections | 2 | Keep warm connections ready |
| Idle Timeout | 30s | Disconnect idle clients |
| Connection Timeout | 30s | Fail fast if unreachable |
| Keep-Alive | ✅ Enabled | Prevent connection drops |
| SSL (Production) | ✅ Enabled | Secure connections |

---

## 🔄 Migration from Redis to PostgreSQL

If you're migrating from the old Redis setup:

**Old (Redis):**
```bash
REDIS_URL=redis://...
```

**New (PostgreSQL):**
```bash
DATABASE_URL=postgresql://...
```

**What changed:**
- ✅ All Redis code replaced with PostgreSQL
- ✅ Better data persistence
- ✅ ACID compliance
- ✅ Relational data support
- ✅ Better Railway integration

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Railway PostgreSQL Guide](https://docs.railway.app/databases/postgresql)
- [Node.js pg Package](https://node-postgres.com/)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## 💡 Pro Tips

1. **Never commit `.env` files** to Git (use `.env.example` instead)
2. **Use DATABASE_URL** when possible - it's more portable
3. **Enable SSL in production** - it's automatic in this setup
4. **Monitor connection pool** - check Railway metrics
5. **Use prepared statements** - they're faster and safer

---

## 🆘 Need Help?

If you're still having issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test database connection manually with `psql`
4. Check Railway/Heroku logs for additional context
5. Review this guide's troubleshooting section

The system provides **extensive logging** to help diagnose connection issues!
