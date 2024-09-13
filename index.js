const express = require("express");
const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

const server = express();

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

server.get("/search", async (req, res) => {
  const { mail, phone_number } = req.query;
  if (mail) {
    try {
      const users_data = JSON.parse(
        await fs.readFileSync(
          path.join(__dirname, "./db-json/users.json"),
          "utf8"
        )
      );
      const m_regex = new RegExp("^" + mail);
      const p_regex = new RegExp("^" + phone_number);
      const users = users_data.filter((value) =>
        phone_number
          ? m_regex.test(value.email) && p_regex.test(value.number)
          : m_regex.test(value.email)
      );
      setTimeout(() => {
        res.send({
          data: users,
        });
      }, 5000);
    } catch (err) {
      throw err;
    }
  } else {
    res.status(400).send({
      message: "Must be mail on param!",
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
