import nodemailer from 'nodemailer';
import { Registration, Course } from '@shared/schema';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

// Email service for sending various notifications
export const emailService = {
  /**
   * Send a confirmation email to the user when their registration is completed
   */
  async sendRegistrationConfirmation(registration: Registration, course: Course): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'info@geospatialtraininghub.com',
        to: registration.email,
        subject: 'Registration Confirmed - Geospatial Training Hub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Registration Confirmed!</h2>
            <p>Dear ${registration.firstName} ${registration.lastName},</p>
            <p>Thank you for registering for our <strong>${course.title}</strong> course. Your registration has been confirmed.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Course Details:</h3>
              <p><strong>Course:</strong> ${course.title}</p>
              <p><strong>Level:</strong> ${course.level}</p>
              <p><strong>Duration:</strong> ${course.duration}</p>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
            </div>
            
            <p>We're excited to have you join us! If you have any questions before the course begins, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>The Geospatial Training Hub Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Registration confirmation email sent to ${registration.email}`);
    } catch (error) {
      console.error('❌ Failed to send registration confirmation email:', error);
    }
  },

  /**
   * Send a notification to the admin when a new registration is received
   */
  async sendAdminNotification(registration: Registration, course: Course): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@geospatialtraininghub.com';
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'info@geospatialtraininghub.com',
        to: adminEmail,
        subject: 'New Course Registration',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Registration Received</h2>
            <p>A new registration has been received for the <strong>${course.title}</strong> course.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Registration Details:</h3>
              <p><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Phone:</strong> ${registration.phone || 'Not provided'}</p>
              <p><strong>Country:</strong> ${registration.country}</p>
              <p><strong>Experience Level:</strong> ${registration.experienceLevel}</p>
              <p><strong>Course:</strong> ${course.title}</p>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
              <p><strong>Date:</strong> ${registration.registrationDate.toLocaleString()}</p>
            </div>
            
            <p>Please review this registration in the admin dashboard.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification email sent to ${adminEmail}`);
    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error);
    }
  },
};