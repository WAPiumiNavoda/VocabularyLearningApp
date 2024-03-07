const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = require('./writingdatasimple.json');

async function uploadData() {
    for(const doc of data) {
        await db.collection('writingdatasimple').add(doc);
    }
}

uploadData();
