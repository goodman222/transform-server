import express from "express";
import ViteExpress from "vite-express";
import nodemailer from "nodemailer";
// import bodyParser from "body-parser";

const app = express();

app.use(express.json());

ViteExpress.listen(app, 4173, () => console.log("Server is listening..."));

//отправляем письмо -----------------------
async function sendEmail(data) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "test34324@mail.ru",
      pass: "s7rH4tRcfcr140G88bJY",
    },
  });

  let result = await transporter.sendMail({
    from: '"Трансформация" <markhrabryi@mail.ru>',
    to: "postpoluchetel@gmail.com",
    subject: "Новая заявка с сайта",
    html: data,
  });
  // console.log(`result: ${result.response}`);
  return result;
}

//принимаем сигнал и данные для отправки письма
app.post("/sendEmail", async (req, res) => {
  const message = `<h1>Новая заявка с сайта!</h2>
  <ul>
    <li>Имя: ${req.body.name}</li>
    <li>Номер телефона: ${req.body.number}</li>
    <li>Электронная почта: ${req.body.email}</li>
    <li>Выбранная программа: ${req.body.tariff}</li>
  </ul>
  `;

  const sendResult = await sendEmail(message);
  console.log("end ------------------");
  console.log(sendResult);
  res.send(sendResult.response.slice(0, 2));
});

//авторизация--------------------------------

app.post("/adminAuth", async (req, res) => {
  // console.log(req.body.password);
  const password = req.body.password;
  if (password === "111") {
    res.send(JSON.stringify({ isPasswordCorrect: true }));
  } else {
    res.send(JSON.stringify({ isPasswordCorrect: false }));
  }
});

// --------------------------------------------

import fs from "fs";
import multer from "multer";

//Сохраняем изменения -----------------------------------------------------
app.post("/saveChanges", async (req, res) => {
  fs.writeFile(
    `./back/db/${req.body.fileName}.json`,
    JSON.stringify(req.body.data),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`succes`);
      }
    }
  );
});

// загрузка фото ----------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./back/images");
  },

  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/uploadPhoto", upload.single("file"), function (req, res, next) {
  res.send(req.file.filename);
});
