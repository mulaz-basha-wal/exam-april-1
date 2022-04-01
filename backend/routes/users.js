const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
const connector = require("../poolconnect");
let salt = bcrypt.genSaltSync(10);

router.get("/createtable", function (req, res) {
  connector.query(
    "CREATE TABLE users_exam (id int primary key, username VARCHAR(50),  password VARCHAR(200));",
    function (err, results) {
      res.json({ err, results });
    }
  );
});

router.get("/", function (req, res) {
  connector.query("select * from users_exam", function (err, results) {
    res.json({ err, results });
  });
});

router.post("/", (req, res) => {
  const { id, username, password } = req.body;
  let encryptedPassword;
  try {
    encryptedPassword = bcrypt.hashSync(password, salt);
    console.log(encryptedPassword);
  } catch (error) {
    console.log("Error in bcrypt");
  }
  const sql = "INSERT INTO users_exam VALUES(?,?,?)";
  connector.query(sql, [id, username, encryptedPassword], (error, result) => {
    res.json({ error, result });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users_exam where username=?";
  connector.query(sql, [username], async (error, result) => {
    if (result.length === 0) {
      res.status(400).json({ status: 0, debug_data: "user not found" });
    } else {
      const passCorrect = await bcrypt.compareSync(
        password,
        result[0].password
      );
      if (!passCorrect) {
        res
          .status(400)
          .json({ status: 0, debug_data: "user credential wrong" });
      } else {
        const payload = {
          user: {
            username,
            password,
          },
        };
        jwt.sign(
          payload,
          "secret_string",
          { expiresIn: 1200 },
          (err, token) => {
            if (err) {
              res
                .status(400)
                .json({ status: 0, debug_data: "temp error in backend" });
            } else {
              res.status(200).json({ token });
            }
          }
        );
      }
    }
  });
});

module.exports = router;
