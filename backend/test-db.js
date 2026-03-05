const mongoose = require('mongoose');

const DB_PASSWORD = encodeURIComponent('(khRuWiQ/$yAmJ8');
const MONGO_URI = `mongodb://rdavedanta:${DB_PASSWORD}@ac-chv1dbc-shard-00-00.iiuazye.mongodb.net:27017,ac-chv1dbc-shard-00-01.iiuazye.mongodb.net:27017,ac-chv1dbc-shard-00-02.iiuazye.mongodb.net:27017/rda_vedanta?ssl=true&replicaSet=atlas-13f3eo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=admin`;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected Successfully');
        const Distributor = require('./models/Distributor');
        const doc = new Distributor({
            companyName: 'Test Company',
            region: 'Telangana',
            phoneNumber: '1234567890'
        });

        try {
            await doc.save();
            console.log('Document saved successfully');
        } catch (e) {
            console.error('Error saving document:');
            console.error(e);
            console.dir(e, { depth: null });
        }

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });
