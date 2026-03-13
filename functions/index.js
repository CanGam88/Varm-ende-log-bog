const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

exports.sendLogMail = functions.firestore
  .document("mail_queue/{docId}")
  .onCreate(async (snap) => {
    const data = snap.data();

    sgMail.setApiKey("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"); // ← indsæt din rigtige nøgle her

    let mailBody = "Daglige logs fra Ropex Logbog App:\n\n";
    data.logs.forEach((d, i) => {
      mailBody += `---------------------------\nLOG #${i+1}\nArbejdsnr: ${d.workNr}\nTid: ${d.date} kl. ${d.time}\nOverskrift: ${d.headline}\nBeskrivelse:\n${d.body}\n\n`;
    });
    mailBody += `---------------------------\nSendt via Logbog App`;

    const msg = {
      to: data.to,
      from: "hhnh.rockwool@gmail.com",
      subject: data.subject,
      text: mailBody
    };

    await sgMail.send(msg);
    await snap.ref.update({ sent: true, sentAt: admin.firestore.FieldValue.serverTimestamp() });
  });
