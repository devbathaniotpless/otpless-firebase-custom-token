const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 3000;



app.get('/auth', (req, res) => {
    const phoneNumber = req.query.phoneNumber;
    console.log("number " + phoneNumber);
    admin.auth().getUserByPhoneNumber(`+${phoneNumber}`)
        .then((userRecord) => {
            res.json({ uid: userRecord.uid, phoneNumber: `+${phoneNumber}` });
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
            admin.auth().createUser({
                phoneNumberVerified: true,
                phoneNumber: `+${phoneNumber}`,
                providerData: [{
                    phoneNumber: `+${phoneNumber}`,
                    providerId: 'phone',
                }],

            })
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    res.json({ uid: userRecord.uid, phoneNumber: `+${phoneNumber}` });
                })
                .catch((error) => {
                    console.log('Error creating new user:', error);
                });
        });
});
app.get('/', (req, res) => {
    res.json("Hello Welcome to OTPless");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
