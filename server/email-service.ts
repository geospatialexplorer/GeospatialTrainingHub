import nodemailer from "nodemailer";
import {Registration, Course, ContactMessage} from "@shared/schema";

// Create transporter using Gmail SMTP and app password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,          // your gmail address
    pass: process.env.GMAIL_APP_PASSWORD,  // your app password generated in Google account
  },
});

export const emailService = {
  async sendRegistrationConfirmation(registration: Registration, course: Course) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: registration.email,
      subject: "Registration Confirmed - Geospatial Training Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Registration Confirmed!</h2>
          <p>Dear ${registration.firstName ?? ""} ${registration.lastName ?? ""},</p>
          <p>Thank you for registering for our <strong>${course.title}</strong> course. Your registration has been confirmed.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Course Details:</h3>
            <p><strong>Course:</strong> ${course.title}</p>
            <p><strong>Level:</strong> ${course.level ?? "N/A"}</p>
            <p><strong>Duration:</strong> ${course.duration ?? "N/A"}</p>
            <p><strong>Registration ID:</strong> ${registration.id}</p>
          </div>
          <p>We're excited to have you join us! If you have any questions before the course begins, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The Geospatial Training Hub Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration confirmation email sent to ${registration.email}`);
  },

  async sendAdminNotification(registration: Registration, course: Course) {
    const regDate = registration.registrationDate instanceof Date
        ? registration.registrationDate
        : new Date(registration.registrationDate ?? Date.now());

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
      subject: "New Course Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Registration Received</h2>
          <p>A new registration has been received for the <strong>${course.title}</strong> course.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Registration Details:</h3>
            <p><strong>Name:</strong> ${registration.firstName ?? ""} ${registration.lastName ?? ""}</p>
            <p><strong>Email:</strong> ${registration.email}</p>
            <p><strong>Phone:</strong> ${registration.phone ?? "Not provided"}</p>
            <p><strong>Country:</strong> ${registration.country ?? "N/A"}</p>
            <p><strong>Experience Level:</strong> ${registration.experienceLevel ?? "N/A"}</p>
            <p><strong>Course:</strong> ${course.title}</p>
            <p><strong>Registration ID:</strong> ${registration.id}</p>
            <p><strong>Date:</strong> ${regDate.toLocaleString()}</p>
          </div>
          <p>Please review this registration in the admin dashboard.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification email sent to ${mailOptions.to}`);
  },

  async sendContactMessageNotification(message: ContactMessage) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
      subject: `New Contact Message: ${message.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Message Received</h2>
          <p><strong>Name:</strong> ${message.name}</p>
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Subject:</strong> ${message.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.message}</p>
          <p>Received at: ${message.createdAt ? new Date(message.createdAt).toLocaleString() : "Unknown"}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact message email sent to ${mailOptions.to}`);
  },
};
