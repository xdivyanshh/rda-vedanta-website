const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(bodyParser.json());


// API Route to handle form submission
app.post('/api/distributors', async (req, res) => {
    try {
        const { companyName, region, phoneNumber } = req.body;
        console.log('Received application:', { companyName, region, phoneNumber });

        // Basic Validation
        if (!companyName || !region || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Send Email Notification using provided credentials
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS (more firewall-friendly than port 465)
            auth: {
                user: 'rdaelectricalspvtltd@gmail.com',
                pass: 'alzo nipe qhoh zhqc'
            }
        });

        const mailOptions = {
            from: 'rdaelectricalspvtltd@gmail.com',
            to: 'rdaelectricalspvtltd@gmail.com', // Send to yourself
            subject: 'New Distributor Application Received',
            text: `You have a new distributor request:\n\nCompany: ${companyName}\nRegion: ${region}\nPhone: ${phoneNumber}\n\nPlease contact them for a callback.`
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error.message);
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            });
        });

        res.status(201).json({ message: 'Distributor request submitted and email sent successfully!' });
    } catch (error) {
        console.error('Submission Error:', error.message);
        res.status(500).json({
            message: 'Server error: ' + error.message + ' (Note: Gmail may require an App Password instead of your regular login password)'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});