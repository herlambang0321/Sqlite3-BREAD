const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/db/data.db";

let db = new sqlite3.Database(path.join(__dirname, "data.db"), (err) => {
  if (err) throw err;
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   console.log("Connected to SQLite database.");
});

// const users = []

app.set("views", path.join(__dirname, "views")); // specify the views
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const page = req.query.page || 1;
  const limit = 3;

  db.all("SELECT COUNT(*) as total FROM newData", (err, data) => {
    if (err) return res.send(err);

    const total = data[0].total;
    const offset = (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    db.all(
      `SELECT * FROM newData limit ${limit} offset ${offset}`, (err, data) => {
        if (err) return res.send(err);

        res.render("index", { data: data, page, pages, offset });
      }
    );
  });
});

app.get("/", (req, res) => {
  db.all("SELECT * FROM newData", (err, data) => {
    if (err) throw err;
    res.render("index", { data });
  });
});
app.get("/add", (req, res) => res.render("add"));

app.post("/add", (req, res) => {
  const { string, integer, float, date, boolean } = req.body;
  db.run(
    `INSERT INTO newData (string, integer, float, date, boolean) VALUES ('${string}', ${integer}, ${float}, '${date}', '${boolean}')`, (err, data) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.all(`SELECT * FROM newData WHERE id = ${id}`, (err, data) => {
    if (err) throw err;
    res.render("edit", { item: data[0] });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { string, integer, float, date, boolean } = req.body;
  db.run(
    `UPDATE newData set string='${string}', integer=${integer}, float=${float}, date='${date}', boolean='${boolean}' where id=${id}`,
    (err, data) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM newData WHERE id = '${id}'`;
  db.run(sql, (err, data) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("This server is running on port 3000!!!");
});