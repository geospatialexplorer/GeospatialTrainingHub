# Supabase Setup Guide

This guide will help you connect your Geospatial Training Hub to Supabase.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "geospatial-training-hub")
5. Enter a database password (save this!)
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Service Role Key** (starts with `eyJ`)
   - **Anon Key** (starts with `eyJ`)

## Step 3: Set Up Environment Variables

1. Create a `.env` file in your project root:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   SUPABASE_ANON_KEY=your_anon_key_here
   PORT=5000
   NODE_ENV=development
   ```

## Step 4: Initialize the Database

Run the database initialization script:

```bash
npm run db:init
```

This will:
- Create the required tables in your Supabase database
- Insert sample courses
- Create an admin user

## Step 5: Test the Connection

Start your development server:

```bash
npm run dev
```

The application will now use Supabase for data storage instead of in-memory storage.

## Step 6: Admin Access

Use these credentials to access the admin dashboard:
- **Email**: `admin@geospatialacademy.com`
- **Password**: `admin123`

## Database Schema

The application creates the following tables:

### `users`
- `id` (SERIAL PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `password` (TEXT)
- `role` (TEXT DEFAULT 'user')
- `created_at` (TIMESTAMP)

### `courses`
- `id` (VARCHAR(100) PRIMARY KEY)
- `title` (VARCHAR(200))
- `description` (TEXT)
- `level` (VARCHAR(50))
- `duration` (VARCHAR(50))
- `price` (DECIMAL(10,2))
- `enrolled` (INTEGER DEFAULT 0)
- `image_url` (TEXT)

### `registrations`
- `id` (SERIAL PRIMARY KEY)
- `first_name` (VARCHAR(100))
- `last_name` (VARCHAR(100))
- `email` (VARCHAR(255))
- `phone` (VARCHAR(20))
- `country` (VARCHAR(100))
- `course_id` (VARCHAR(100))
- `experience_level` (VARCHAR(50))
- `goals` (TEXT)
- `agree_terms` (BOOLEAN DEFAULT false)
- `newsletter` (BOOLEAN DEFAULT false)
- `status` (VARCHAR(20) DEFAULT 'pending')
- `registration_date` (TIMESTAMP)

### `contact_messages`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))
- `email` (VARCHAR(255))
- `subject` (VARCHAR(100))
- `message` (TEXT)
- `created_at` (TIMESTAMP)

### `banners`
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(200))
- `subtitle` (TEXT)
- `image_url` (TEXT)
- `link_url` (TEXT)
- `link_text` (VARCHAR(100))
- `is_active` (BOOLEAN DEFAULT true)
- `display_order` (INTEGER DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `website_settings`
- `id` (SERIAL PRIMARY KEY)
- `key` (VARCHAR(100) UNIQUE)
- `value` (TEXT)
- `type` (VARCHAR(50))
- `description` (TEXT)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file exists and contains the correct values
   - Check that the environment variables are being loaded

2. **"Failed to create tables"**
   - This is normal if tables already exist
   - Check your Supabase dashboard to verify tables were created

3. **"Connection refused"**
   - Verify your Supabase URL is correct
   - Check that your project is active in the Supabase dashboard

4. **"Invalid API key"**
   - Make sure you're using the Service Role Key, not the Anon Key
   - Verify the key hasn't been rotated

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the Supabase dashboard logs
- Check your application console for error messages

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit your `.env` file** - it contains sensitive credentials
2. **Use environment variables** in production, not hardcoded values
3. **Rotate your API keys** regularly
4. **Use Row Level Security (RLS)** in production for better security
5. **Hash passwords** in production (the current setup uses plain text for demo purposes)

## Production Deployment

For production deployment:

1. Set up Row Level Security (RLS) policies in Supabase
2. Use proper password hashing (bcrypt, argon2, etc.)
3. Set up proper CORS policies
4. Use environment variables for all sensitive data
5. Consider using Supabase Auth for user management
6. Set up database backups

## Next Steps

After setting up Supabase:

1. Customize the sample courses
2. Add more admin users
3. Implement proper authentication
4. Add payment processing
5. Set up email notifications
6. Add course content management