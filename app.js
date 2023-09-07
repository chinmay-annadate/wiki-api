const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get(function (req, res) {
    Article.find({}).then((data) => {
      res.send(data);
    });
  })

  .post(function (req, res) {
    Article.insertMany([
      new Article({ title: req.body.title, content: req.body.content }),
    ]);
  })

  .delete(function (req, res) {
    Article.deleteMany({}).then((data) => {
      res.send(data);
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }).then((data) => {
      res.send(data);
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    ).then(res.send("Done"));
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body }
    ).then(res.send("Done"));
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }).then((data) => {
      res.send(data);
    });
  });

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
