const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

function setDispenserData(feed = null, feedAmount = null) {
    let updateObj = {};

    if (feedAmount) { Object.assign(updateObj, { feedAmount }) }
    if (feed !== null) { Object.assign(updateObj, { feed }) }

    return admin.database().ref('/Dispenser').update(updateObj)
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.manualFeed = functions.https.onRequest(async (request, response) => {
    await setDispenserData(true);
    response.send("Feed request was sent");
});

exports.feedCatsSchedule = functions.pubsub.schedule('every 10 hours from 08:00 to 20:00').onRun((context) => {
    setDispenserData(true);
});