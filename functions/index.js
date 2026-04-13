// v5 - Nodemailer med Gmail App Password via .env fil
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

exports.sendLogMail = functions.firestore
  .document("mail_queue/{docId}")
  .onCreate(async (snap) => {
    const data = snap.data();

    // Opret transporter med Gmail App Password fra environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Byg mail-tekst fra logs
    let mailBody = "Daglige logs fra Ropex Logbog App:\n\n";
    data.logs.forEach((d, i) => {
      mailBody += `---------------------------\nLOG #${i + 1}\nArbejdsnr: ${d.workNr}\nTid: ${d.date} kl. ${d.time}\nOverskrift: ${d.headline}\nBeskrivelse:\n${d.body}\n\n`;
    });
    mailBody += `---------------------------\nSendt via Logbog App`;

    // Normaliser modtagere - accepter både string og array
    const recipients = Array.isArray(data.to) ? data.to.join(", ") : data.to;

    const mailOptions = {
      from: `"Ropex Logbog" <${process.env.GMAIL_USER}>`,
      to: recipients,
      subject: data.subject,
      text: mailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      await snap.ref.update({
        sent: true,
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log("Mail sendt til:", recipients);
    } catch (error) {
      console.error("Fejl ved afsendelse:", error);
      await snap.ref.update({
        sent: false,
        error: error.message
      });
      throw error;
    }
  });
