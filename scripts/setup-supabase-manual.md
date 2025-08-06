# Manual Supabase Database Setup

If the automatic setup script doesn't work, you can manually create the database tables through the Supabase dashboard.

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

## Step 2: Create Tables

Copy and paste the following SQL into the editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  enrolled INTEGER NOT NULL DEFAULT 0,
  image_url TEXT
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  goals TEXT,
  agree_terms BOOLEAN NOT NULL DEFAULT false,
  newsletter BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  registration_date TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_text VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

Click **Run** to execute the SQL.

## Step 3: Insert Sample Data

Create another query and paste this SQL:

```sql
-- Insert admin user
INSERT INTO users (username, password, role) 
VALUES ('admin@geospatialacademy.com', 'admin123', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (id, title, description, level, duration, price, enrolled, image_url) VALUES
('gis-fundamentals', 'GIS Fundamentals & ESRI ArcGIS', 'Master the basics of Geographic Information Systems using industry-standard ESRI ArcGIS software. Perfect for beginners.', 'Beginner', '40 hours', 299.00, 324, 'https://pixabay.com/get/g5f7f3b1fbad579eed5df651b5a1122caaea2ed21d4488ecdef7bf626211fbfd07d5876e3afe23548a2550a0e93b93c72_1280.jpg'),
('remote-sensing', 'Remote Sensing & Image Analysis', 'Learn advanced satellite image processing, spectral analysis, and environmental monitoring techniques.', 'Intermediate', '60 hours', 449.00, 189, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'),
('spatial-analysis', 'Advanced Spatial Analysis & Modeling', 'Master complex spatial analysis, 3D modeling, and predictive analytics for professional GIS applications.', 'Advanced', '80 hours', 599.00, 156, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'),
('python-gis', 'Python for Geospatial Analysis', 'Learn Python programming for GIS automation, data processing, and custom geospatial applications.', 'Intermediate', '50 hours', 399.00, 278, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'),
('drone-surveying', 'Drone Surveying & Photogrammetry', 'Master UAV data collection, photogrammetry, and drone-based mapping for professional surveying.', 'Specialized', '45 hours', 549.00, 142, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'),
('web-gis', 'Web GIS & Location Services', 'Build interactive web maps and location-based applications using modern web technologies and APIs.', 'Professional', '55 hours', 499.00, 201, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')
ON CONFLICT (id) DO NOTHING;

-- Insert sample banners
INSERT INTO banners (title, subtitle, image_url, link_url, link_text, is_active, display_order) VALUES
('Welcome to Geospatial Training Hub', 'Your journey to GIS mastery starts here', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400', '#courses', 'Explore Courses', true, 1),
('New Course: Python for Geospatial Analysis', 'Learn how to automate GIS workflows with Python', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400', '/courses/python-gis', 'Learn More', true, 2),
('Join Our Community', 'Connect with other GIS professionals', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400', '#contact', 'Contact Us', true, 3);

-- Insert default website settings
INSERT INTO website_settings (key, value, type, description) VALUES
('site_title', 'Geospatial Training Hub', 'string', 'Website title displayed in browser tab'),
('site_description', 'Professional training for GIS and geospatial technologies', 'string', 'Meta description for SEO'),
('contact_email', 'info@geospatialtraininghub.com', 'string', 'Primary contact email'),
('contact_phone', '+1 (555) 123-4567', 'string', 'Primary contact phone number'),
('social_facebook', 'https://facebook.com/geospatialtraininghub', 'string', 'Facebook page URL'),
('social_twitter', 'https://twitter.com/geospatialtraining', 'string', 'Twitter profile URL'),
('social_linkedin', 'https://linkedin.com/company/geospatialtraininghub', 'string', 'LinkedIn company page URL'),
('enable_banner_carousel', 'true', 'boolean', 'Enable or disable the banner carousel on homepage'),
('banner_autoplay', 'true', 'boolean', 'Enable or disable autoplay for banner carousel'),
('banner_interval', '5000', 'number', 'Time interval between banner slides in milliseconds')
ON CONFLICT (key) DO NOTHING;
```

Click **Run** to execute the SQL.

## Step 4: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see 6 tables: `users`, `courses`, `registrations`, `contact_messages`, `banners`, and `website_settings`
3. Click on each table to verify the data was inserted correctly

## Step 5: Test Your Application

1. Make sure your `.env` file is configured with your Supabase credentials
2. Start your application: `npm run dev`
3. Test the admin login with:
   - Email: `admin@geospatialacademy.com`
   - Password: `admin123`

## Troubleshooting

If you encounter issues:

1. **Check table names**: Make sure they match exactly (lowercase with underscores)
2. **Verify data types**: Ensure the column types match the schema
3. **Check constraints**: Make sure primary keys and unique constraints are set correctly
4. **Review Supabase logs**: Check the dashboard for any error messages

## Next Steps

After manual setup:

1. Test all application features
2. Add more sample data if needed
3. Customize the courses and content
4. Set up Row Level Security (RLS) for production use