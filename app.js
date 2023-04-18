const express = require("express");
const bp = require("body-parser");
const request = require("request");
const path = require("path");
const https = require("https");

const app = express();

app.use(express.static(path.join(__dirname + "/public")));
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/signUp.html"));
});

app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  console.log(fname, lname, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/cef6f75973";
  const options = {
    method: "POST",
    auth: `bunty07:${process.env.API_KEY}`,
  };
  const requ = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname + "/succ.html"));
    } else {
      res.sendFile(path.join(__dirname + "/fail.html"));
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  requ.write(jsondata);
  requ.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});

// API KEY`: ${process.env.API_KE`}
// LIst id :cef6f75973
