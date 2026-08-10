const nodemailer = require('nodemailer')

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Do not verify email transporter on startup to avoid login failure noise.

exports.sendContactEmail = async (contactData) => {
  const { name, email, phone, message, ipAddress } = contactData

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Inquiry from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .header { background: #16324F; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #16324F; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Inquiry</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div>${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div><a href="tel:${phone}">${phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div>${message}</div>
            </div>
            <hr>
            <div class="field">
              <div class="label">IP Address:</div>
              <div>${ipAddress || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="label">Time:</div>
              <div>${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>HB Hardware - Contact Inquiry Notification</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Contact email sent for ${name}`)
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

exports.sendQuoteEmail = async (quoteData) => {
  const { name, email, phone, productCategory, message, ipAddress } = quoteData

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Quote Request from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .header { background: #F28C28; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #16324F; }
          .category-badge { display: inline-block; background: #16324F; color: white; padding: 5px 10px; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Quote Request</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div>${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div><a href="tel:${phone}">${phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Product Category:</div>
              <div><span class="category-badge">${productCategory}</span></div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div>${message}</div>
            </div>
            <hr>
            <div class="field">
              <div class="label">IP Address:</div>
              <div>${ipAddress || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="label">Time:</div>
              <div>${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>HB Hardware - Quote Request Notification</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Quote email sent for ${name}`)
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

exports.sendAdminNotification = async (subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject,
    html: htmlContent
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Admin notification sent: ${subject}`)
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}