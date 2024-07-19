const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 3000;

const DB = new pg.Client({
    host: "localhost",
    password: "Innocent321@",
    database: "world",
    port: 5432,
    user: "postgres",
});
DB.connect();

let sumOfCorrect = 0;
let ques = [];
let currentQuention = {};

DB.query("SELECT * FROM languages", (err, res) => {
    if (err){
        console.log("ERROR IN EXECUTION", err);
    }else{
        ques = res.rows;
        nextQuestion();
    }
    DB.end();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    sumOfCorrect = 0;
    nextQuestion();
    res.render('index.ejs', {question: currentQuention});
});

app.post("/submit", (req, res) => {
    let language = req.body.language.trim();
    let isCorrect = false;
    if (currentQuention.country.toLowerCase() === language.toLowerCase()) {
        sumOfCorrect++;
        isCorrect = true;
    }

    nextQuestion();
    res.render("index.ejs", {
        question: currentQuention,
        Correct: isCorrect,
        totalScore: sumOfCorrect,
      });
});

function nextQuestion() {
    const generateQues = ques[Math.floor(Math.random() * ques.length)];
    currentQuention = generateQues;
}


app.listen(PORT, () =>{
    console.log(`PORT RUNNING ON ${PORT}`);
})