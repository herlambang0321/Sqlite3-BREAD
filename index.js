const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/db/data.db";

let db = new sqlite3.Database(path.join(__dirname, "data.db"), (err) => {
  if (err) throw err;
});

app.set("views", path.join(__dirname, "views")); // specify the views
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const { id, string, integer, float, date, boolean } = req.query;

  const url = req.url == "/" ? "/?page=1" : req.url;
  const page = req.query.page || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  let params = [];

  if (id) {
    params.push(`id=${id}`);
  }

  if (string) {
    params.push(`string like '%${string}%'`);
  }

  if (integer) {
    params.push(`integer=${integer}`);
  }

  if (float) {
    params.push(`float=${float}`);
  }

  if (date) {
    params.push(`date=${date}`);
  }

  if (boolean) {
    params.push(`boolean='${boolean}'`);
  }

  let sql = "SELECT COUNT(*) as total FROM newData";

  if (params.length > 0) {
    sql += ` WHERE ${params.join(" and ")}`;
  }
  // console.log(sql)
  db.all(sql, (err, data) => {
    if (err) return res.send(err);

    const total = data[0].total;
    const pages = Math.ceil(total / limit);

    sql = `SELECT * FROM newData`;

    if (params.length > 0) {
      sql += ` WHERE ${params.join(" and ")}`;
    }

    sql += ` limit ${limit} offset ${offset}`;

    db.all(sql, (err, data) => {
      if (err) return res.send(err);

      res.render("index", {
        data: data,
        page,
        pages,
        offset,
        url,
        query: req.query,
      });
    });
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
    `INSERT INTO newData (string, integer, float, date, boolean) VALUES ('${string}', ${integer}, ${float}, '${date}', '${boolean}')`,
    (err, data) => {
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
