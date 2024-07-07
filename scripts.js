document.getElementById('quiz-form').addEventListener('submit', function (e) {
    e.preventDefault();
    createQuiz();
});

function addQuestion() {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-item';
    questionContainer.innerHTML = `
        <span class="question-number"></span>
        <textarea class="quiz-ques" placeholder="Question" required></textarea>
        <div class="answer-container">
        <input type="text" class="quiz-answer" placeholder="Choice 1" required>
        <input type="text" class="quiz-answer" placeholder="Choice 2" required>
        <input type="text" class="quiz-answer" placeholder="Choice 3" required>
        <input type="text" class="quiz-answer" placeholder="Choice 4" required>
        <input type="text" class="quiz-correct-answer" placeholder="Correct Choice (1-4)" required>
        </div>
    `;
    document.getElementById('questions-container').appendChild(questionContainer);

    updateQuestionNumbers();
    addTextareaAutoResize(questionContainer.querySelector('.quiz-ques'));
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = '';
    textarea.style.height = (textarea.scrollHeight + 2 )+ 'px';
}

function addTextareaAutoResize(textarea) {
    textarea.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });

    adjustTextareaHeight(textarea);
}

document.querySelectorAll('.quiz-ques').forEach(textarea => {
    textarea.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    addTextareaAutoResize(textarea);
});


function createQuiz() {
    const title = document.getElementById('quiz-title').value;
    const questions = Array.from(document.getElementsByClassName('question-item')).map(item => {
        const questionTextarea = item.querySelector('.quiz-ques');
        const inputs = item.getElementsByTagName('input');
        return {
            question: questionTextarea.value,
            choices: [
                inputs[0].value,
                inputs[1].value,
                inputs[2].value,
                inputs[3].value
            ],
            correct: inputs[4].value
        };
    });

    const quiz = { title, questions };
    const quizId = 'quiz-' + Date.now();
    localStorage.setItem(quizId, JSON.stringify(quiz));

    const url = window.location.href.split('?')[0] + '?quiz=' + quizId;
    alert('Quiz created! Share this URL: ' + url);
}

function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function displayQuiz(quizId) {
    const quiz = JSON.parse(localStorage.getItem(quizId));
    if (!quiz) {
        alert('Quiz not found!');
        return;
    }

    document.getElementById('quiz-creation').style.display = 'none';
    document.getElementById('quiz-display').style.display = 'block';
    document.getElementById('display-title').innerText = quiz.title;

    const displayQuestions = document.getElementById('display-questions');
    displayQuestions.innerHTML = '';

    quiz.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item-display';
        questionDiv.innerHTML = `
            <span>Q${index + 1}. </span>
            <pre class="question-text">${escapeHtml(q.question)}</pre>
            <div class="options-container">
                ${q.choices.map((choice, i) => `
                    <label class="option">
                        <input type="radio" name="question${index}" value="${i + 1}">
                        ${escapeHtml(choice)}
                    </label>
                `).join('')}
            </div>
        `;
        displayQuestions.appendChild(questionDiv);
    });
}

function submitQuiz() {
    const quizId = new URLSearchParams(window.location.search).get('quiz');
    const quiz = JSON.parse(localStorage.getItem(quizId));
    const displayQuestions = document.getElementById('display-questions');
    let score = 0;

    quiz.questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && selected.value == q.correct) {
            score++;
        }
    });

    document.getElementById('quiz-display').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('result-score').innerText = `You scored ${score} out of ${quiz.questions.length}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const quizId = new URLSearchParams(window.location.search).get('quiz');
    if (quizId) {
        displayQuiz(quizId);
    }
});

function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-number');
    questions.forEach((numberElement, index) => {
        numberElement.textContent = `Q${index + 1}.`;
    });
}