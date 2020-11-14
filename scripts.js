//XXX get quiz settings
const generateBtn = document.getElementById("generateBtn");
const amount = document.getElementById("amount");


function getQuizSettings() {
    const formGen = document.getElementById("generateForm");
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;
    const values = [
        { key: "amount", value: amount, sym: "=" },
        { key: "category", value: category, sym: "=" },
        { key: "difficulty", value: difficulty, sym: "=" },
        { key: "type", value: type, sym: "=" }
    ];
    //get filtered values
    const valuesFilt = [];
    for (let item of values) {
        if (item.value != "any") {
            valuesFilt.push(item);
        }
    };
    //push values into array and make string out of it
    const result = [];
    valuesFilt.forEach(item => {
        const a = `${item.key}${item.sym}${item.value}`;
        result.push(a);
    })
    let resultStr = result.join("&");
    const genURL = `https://opentdb.com/api.php?${resultStr}`;
    return genURL;
}

function getDataFromAPI() {
    fetch(getQuizSettings())
        .then(res => res.json())
        .then(json => {
            data.push(...json.results);
        })
        .then(() => {
            joinAnswers(data);
            setId(data);
            setInitialScore(data);
            renderQuiz(data);
        })
        .catch(err => { throw err });
}

const data = [];
//Event listeners
generateBtn.addEventListener("click", getQuizSettings);
generateBtn.addEventListener("click", getDataFromAPI);
amount.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.keyCode != 13) { return }
    getQuizSettings();
    getDataFromAPI();
});


//XXX generate Quiz
const quiz = document.getElementById("quiz");

//randomly shuffle answers in array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

//join and shuffle correct & incorrect answers to 1 arr
function joinAnswers(data) {
    data.forEach(obj => {
        let answers = obj.incorrect_answers.concat(obj.correct_answer);
        shuffle(answers);
        obj.answers = answers;
    })
}

function setId(data) {
    data.forEach(obj => {
        const id = data.indexOf(obj);
        obj.id = id;
    })
}

function renderAnswers(obj) {
    let str = "";
    obj.answers.forEach(answer => {
        let item = `<li class="quiz--answer" value="obj">${answer}</li>`;
        str += item;
    });
    return str;
}

function renderQuizItem(obj) {
    let item =
        `
        <div class="quiz--item" id=${obj.id}>
            <h4 class="quiz--question">${obj.question}</h4>
            <ul class="quiz--answers">
                ${renderAnswers(obj)}
            </ul>
        </div>
        `;
    return item;
}

function renderQuiz(data) {
    let items = "";
    data.forEach(obj => {
        const item = renderQuizItem(obj);
        items += item;
    })
    items += `<div id="restart" class="button">Play again!</div>`;
    quiz.innerHTML = items;

    const score = document.getElementsByClassName("score-h4")[0];
    const generateQuiz = document.getElementById("generate-quiz");
    score.classList.add("show");
    generateQuiz.classList.add("hide");
    quiz.classList.add("show");
}


/* XXX Results */
let currentScore = 0;

function setInitialScore(data) {
    const currentEl = document.getElementById("score");
    const totalEl = document.getElementById("total");
    total = data.length;
    currentEl.innerHTML = currentScore;
    totalEl.innerHTML = total;
}

function updateScore() {
    const scoreEl = document.getElementById("score");
    currentScore = currentScore + 1;
    scoreEl.innerText = currentScore;
}

function isClicked(el) {
    const ul = el.parentElement;
    let result = false;

    ul.querySelector("li.false") || ul.querySelector("li.true") ? result = true : result = false;
    return result;
}

function resolve(e) {
    if (!e.target.matches("li")) { return }
    const el = e.target;
    const elText = e.target.innerText;
    const id = e.target.parentElement.parentElement.id;
    const currentObj = data.filter(obj => obj.id == id)[0];

    if (isClicked(el) == true) { return };

    if (elText == currentObj.correct_answer) {
        el.classList.add("true");
        updateScore();
    } else {
        el.classList.add("false")
    }
}

quiz.addEventListener("click", resolve);