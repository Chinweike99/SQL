import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

let totalCorrect = 0;

const DB = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Innocent321@",
  port: 5432,
});

DB.connect();

let quiz = [];

DB.query("SELECT * FROM flags", (err, res)=>{
  if (err){
    console.log("Error executing", err)
  }else{
    quiz = res.rows;
  }
  DB.end();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  // if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
  //   totalCorrect++;
  //   console.log(totalCorrect);
  //   isCorrect = true;
  // }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
