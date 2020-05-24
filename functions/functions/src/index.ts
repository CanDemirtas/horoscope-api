import * as functions from 'firebase-functions';

// const express = require('express');
// const cors = require('cors');
// const app = express();

// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

// import { parse } from 'node-html-parser';

// const root: any = parse('<ul id="list"><li>Hello World</li></ul>');


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
const fetch = require("node-fetch");

let baseDailyUrl = "https://www.kadinlarduysun.com/gunluk-burc-yorumlari"
admin.initializeApp();

exports.showDomContent = functions.https.onRequest((req, res) => {

    const horoscopeName = req.query.name;
    const url = baseDailyUrl + ("/" + horoscopeName + "-burcu-gunluk-burc-yorumu").trim();
    const result = fetch(url)
        .then((response: any) => response.text())
        .then((text: any) => {
            const DOMParser = require('xmldom').DOMParser;
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/xml").getElementsByClassName("reading")[0];
            console.log(htmlDocument.firstChild.innerHTML);
            const response = res.json({ title: htmlDocument.childNodes[1].textContent, content: htmlDocument.childNodes[3].textContent });
            return response;
        })
        .catch((err: any) => console.log(err));
    // fetch('https://www.sabah.com.tr/magazin/2020/05/23/uzman-astrolog-zeynep-turan-ile-gunluk-burc-yorumlari-23-mayis-2020-cumartesi-gunluk-burc-yorumu-ve-astroloji/')
    //     .then(resp => resp.text()).then(body => console.log(body)).catch(err => console.log(err));


    if (result)
        return result;
    res.json({ result: 'Horoscope content:' });
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({ original: original });
    // Send back a message that we've succesfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});
