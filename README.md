# Firebase Custom Token

Integrating One Tap OTPLESS Sign In into your Flutter Application using our SDK is a streamlined process. This guide offers a comprehensive walkthrough, detailing the steps to install the SDK and seamlessly retrieve user information.

1. Install **Firebase Admin SDK**

```
Install the Servicekey.json file from the Firebase Admin SDK from firebase Project settings -> Service accounts
```

2. **Node Js** Setup

- Create a node js project and install the dependencies
  
```
mkdir my-nodejs-project
cd my-nodejs-project
npm init -y
```

- Run this command in the terminal to add firebase-admin

```
npm i firebase-admin
```

- Run this command in the terminal to add firebase-admin

```
npm i express
```

3.  Add the **Servicekey** file

- Add the downloaded file in the node.js project and rename the file with serviceAccountKey

4. Add **Firebase** Code

- Add the given code to create get api for the frontend call 

```javascript
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
            admin.auth()
                .createCustomToken(userRecord.uid)
                .then((customToken) => {
                    res.json({ token: customToken });
                })
                .catch((error) => {
                    console.log('Error creating custom token:', error);
                });

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
                    admin.auth()
                        .createCustomToken(userRecord.uid)
                        .then((customToken) => {
                            res.json({ token: customToken });
                        })
                        .catch((error) => {
                            console.log('Error creating custom token:', error);
                        });

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

```

- Response

```
{token: custom_token}
```
Use this custom token on frontend firebase function of signInWithCustomToken(custom_token) to fetch the UID and other user details/

# Thank You

# [Visit OTPless](https://otpless.com/platforms/flutter)
