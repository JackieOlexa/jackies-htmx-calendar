const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const functions = require("firebase-functions");
const axios = require('axios');
const admin = require("firebase-admin");

const pug = require('pug');


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: null,
    authDomain: "jackies-first-test.firebaseapp.com",
    databaseURL: "https://jackies-first-test-default-rtdb.firebaseio.com",
    projectId: "jackies-first-test",
    storageBucket: "jackies-first-test.appspot.com",
    messagingSenderId: "502972278830",
    appId: "1:502972278830:web:ce3428ef5fe6909cb2d7bf"
};

admin.initializeApp(firebaseConfig);

const params = {
}
const db = admin.firestore();
const docRef = db.collection('Holidays').doc('2024');

exports.holidaylist = functions
    .runWith({ timeoutSeconds: 60, memory: "1GB" })
    .pubsub
    .schedule('every 24 hours')
    .onRun(async context => {
        await axios.get('https://date.nager.at/api/v3/publicholidays/2024/US', { params })
            .then(response => {
                const apiResponse = response.data;
                docRef.set({
                    current: apiResponse,
                })
            }).catch(error => {
                console.log(error);
            });
    });


exports.test = onRequest((request, response) => {
    let template = pug.compileFile('views/calendar.pug');
    let markup = template({
        name: request.query.name,
        major: request.query.major,
        quote: request.query.quote,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(markup);
});

exports.todo = onRequest((request, response) => {
    let template = pug.compileFile('views/addToDo.pug');
    let markup = template({
        item: request.query.item,
        date: request.query.date,
        notes: request.query.notes,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(markup);
});

exports.event = onRequest((request, response) => {
    let template = pug.compileFile('views/addEvent.pug');
    let markup = template({
        item: request.query.item,
        date: request.query.date,
        location: request.query.loction,
        notes: request.query.notes,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(markup);
});


