import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL to create tables
const createTablesSQL = `
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
`;

// Sample data
const sampleCourses = [
  {
    id: "gis-fundamentals",
    title: "GIS Fundamentals & ESRI ArcGIS",
    description: "Master the basics of Geographic Information Systems using industry-standard ESRI ArcGIS software. Perfect for beginners.",
    level: "Beginner",
    duration: "40 hours",
    price: "299.00",
    enrolled: 324,
    image_url: "https://pixabay.com/get/g5f7f3b1fbad579eed5df651b5a1122caaea2ed21d4488ecdef7bf626211fbfd07d5876e3afe23548a2550a0e93b93c72_1280.jpg"
  },
  {
    id: "remote-sensing",
    title: "Remote Sensing & Image Analysis",
    description: "Learn advanced satellite image processing, spectral analysis, and environmental monitoring techniques.",
    level: "Intermediate",
    duration: "60 hours",
    price: "449.00",
    enrolled: 189,
    image_url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "spatial-analysis",
    title: "Advanced Spatial Analysis & Modeling",
    description: "Master complex spatial analysis, 3D modeling, and predictive analytics for professional GIS applications.",
    level: "Advanced",
    duration: "80 hours",
    price: "599.00",
    enrolled: 156,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "python-gis",
    title: "Python for Geospatial Analysis",
    description: "Learn Python programming for GIS automation, data processing, and custom geospatial applications.",
    level: "Intermediate",
    duration: "50 hours",
    price: "399.00",
    enrolled: 278,
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "drone-surveying",
    title: "Drone Surveying & Photogrammetry",
    description: "Master UAV data collection, photogrammetry, and drone-based mapping for professional surveying.",
    level: "Specialized",
    duration: "45 hours",
    price: "549.00",
    enrolled: 142,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "web-gis",
    title: "Web GIS & Location Services",
    description: "Build interactive web maps and location-based applications using modern web technologies and APIs.",
    level: "Professional",
    duration: "55 hours",
    price: "499.00",
    enrolled: 201,
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  }
];

const adminUser = {
  username: "admin@geospatialacademy.com",
  password: "admin123", // In production, this should be hashed
  role: "admin"
};

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Supabase database...');

    // Create tables
    console.log('📋 Creating tables...');
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (tableError) {
      console.log('Note: Tables might already exist or RPC function not available. Continuing...');
    }

    // Insert admin user
    console.log('👤 Creating admin user...');
    const { error: userError } = await supabase
      .from('users')
      .upsert(adminUser, { onConflict: 'username' });
    
    if (userError) {
      console.error('Error creating admin user:', userError);
    } else {
      console.log('✅ Admin user created/updated');
    }

    // Insert sample courses
    console.log('📚 Inserting sample courses...');
    const { error: courseError } = await supabase
      .from('courses')
      .upsert(sampleCourses, { onConflict: 'id' });
    
    if (courseError) {
      console.error('Error inserting courses:', courseError);
    } else {
      console.log('✅ Sample courses inserted/updated');
    }
    
    // Insert sample banners
    console.log('🖼️ Inserting sample banners...');
    const sampleBanners = [
      {
        title: "Welcome to Geospatial Training Hub",
        subtitle: "Your journey to GIS mastery starts here",
        image_url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        link_url: "#courses",
        link_text: "Explore Courses",
        is_active: true,
        display_order: 1
      },
      {
        title: "New Course: Python for Geospatial Analysis",
        subtitle: "Learn how to automate GIS workflows with Python",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        link_url: "/courses/python-gis",
        link_text: "Learn More",
        is_active: true,
        display_order: 2
      },
      {
        title: "Join Our Community",
        subtitle: "Connect with other GIS professionals",
        image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        link_url: "#contact",
        link_text: "Contact Us",
        is_active: true,
        display_order: 3
      }
    ];
    
    const { error: bannerError } = await supabase
      .from('banners')
      .upsert(sampleBanners);
    
    if (bannerError) {
      console.error('Error inserting banners:', bannerError);
    } else {
      console.log('✅ Sample banners inserted/updated');
    }
    
    // Insert default website settings
    console.log('⚙️ Inserting default website settings...');
    const defaultSettings = [
      {
        key: "site_title",
        value: "Geospatial Training Hub",
        type: "string",
        description: "Website title displayed in browser tab"
      },
      {
        key: "site_description",
        value: "Professional training for GIS and geospatial technologies",
        type: "string",
        description: "Meta description for SEO"
      },
      {
        key: "contact_email",
        value: "info@geospatialtraininghub.com",
        type: "string",
        description: "Primary contact email"
      },
      {
        key: "contact_phone",
        value: "+1 (555) 123-4567",
        type: "string",
        description: "Primary contact phone number"
      },
      {
        key: "social_facebook",
        value: "https://facebook.com/geospatialtraininghub",
        type: "string",
        description: "Facebook page URL"
      },
      {
        key: "social_twitter",
        value: "https://twitter.com/geospatialtraining",
        type: "string",
        description: "Twitter profile URL"
      },
      {
        key: "social_linkedin",
        value: "https://linkedin.com/company/geospatialtraininghub",
        type: "string",
        description: "LinkedIn company page URL"
      },
      {
        key: "enable_banner_carousel",
        value: "true",
        type: "boolean",
        description: "Enable or disable the banner carousel on homepage"
      },
      {
        key: "banner_autoplay",
        value: "true",
        type: "boolean",
        description: "Enable or disable autoplay for banner carousel"
      },
      {
        key: "banner_interval",
        value: "5000",
        type: "number",
        description: "Time interval between banner slides in milliseconds"
      }
    ];
    
    const { error: settingsError } = await supabase
      .from('website_settings')
      .upsert(defaultSettings, { onConflict: 'key' });
    
    if (settingsError) {
      console.error('Error inserting website settings:', settingsError);
    } else {
      console.log('✅ Default website settings inserted/updated');
    }

    console.log('🎉 Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Set up your environment variables:');
    console.log('   SUPABASE_URL=your_supabase_url');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.log('2. Run your application with: npm run dev');
    console.log('3. Admin login: admin@geospatialacademy.com / admin123');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();