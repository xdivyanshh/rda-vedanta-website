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
        console.error('MongoDB Connection Error:', err.message);
        console.log('Hint: Ensure your IP address is whitelisted in MongoDB Atlas Network Access.');
    });

// API Route to handle form submission
app.post('/api/distributors', async (req, res) => {
    try {
        const { companyName, region, phoneNumber } = req.body;
        console.log('Received application:', { companyName, region, phoneNumber });

        // Basic Validation
        if (!companyName || !region || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Try to save to Database (Optional now, won't break if it fails)
        try {
            if (mongoose.connection.readyState === 1) {
                const newDistributor = new Distributor({ companyName, region, phoneNumber });
                await newDistributor.save();
                console.log('Saved to MongoDB successfully');
            } else {
                console.log('MongoDB not connected, skipping DB save');
            }
        } catch (dbError) {
            console.log('Warning: Failed to save to MongoDB:', dbError.message);
        }

        // Send Email Notification using provided credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rdaelectricalspvtltd@gmail.com',
                pass: 'hjdhcbjdykoitkcu'
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