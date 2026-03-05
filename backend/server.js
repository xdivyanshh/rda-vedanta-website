const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Distributor = require('./js/Distributor');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(bodyParser.json());

// MongoDB Connection
// We use encodeURIComponent to handle special characters in the password automatically
const DB_PASSWORD = encodeURIComponent('(khRuWiQ/$yAmJ8');
const MONGO_URI = `mongodb://rdavedanta:${DB_PASSWORD}@ac-chv1dbc-shard-00-00.iiuazye.mongodb.net:27017,ac-chv1dbc-shard-00-01.iiuazye.mongodb.net:27017,ac-chv1dbc-shard-00-02.iiuazye.mongodb.net:27017/rda_vedanta?ssl=true&replicaSet=atlas-13f3eo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=admin`;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        console.log('Hint: Ensure your IP address is whitelisted in MongoDB Atlas Network Access.');
    });

// API Route to handle form submission
app.post('/api/distributors', async (req, res) => {
    try {
        const { companyName, region, phoneNumber } = req.body;

        // Basic Validation
        if (!companyName || !region || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newDistributor = new Distributor({
            companyName,
            region,
            phoneNumber
        });

        // 1. Save to Database
        await newDistributor.save();

        // 2. Send Email Notification (Data reaches you directly)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email provider
            auth: {
                user: 'rdaelectricalspvtltd@gmail.com', // Replace with your email
                pass: 'rda@1234'     // Replace with your App Password
            }
        });

        const mailOptions = {
            from: 'rdaelectricalspvtltd@gmail.com',
            to: 'rdaelectricalspvtltd@gmail.com', // Send to yourself
            subject: 'New Distributor Application Received',
            text: `You have a new distributor request:\n\nCompany: ${companyName}\nRegion: ${region}\nPhone: ${phoneNumber}\n\nPlease contact them for a callback.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({ message: 'Distributor request submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});