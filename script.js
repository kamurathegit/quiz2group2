let difficulty;
let playerName = "";
let questions = [];
let currentQuestion = 0;
let score = { correct: 0, wrong: 0, noAnswer: 0 };
let timerInterval;
let timeLimit = 0;
// Function to start the game with selected difficulty
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    if (difficulty === "easy") {
        timeLimit = 10; // 10 seconds for easy
    } else if (difficulty === "medium") {
        timeLimit = 20; // 20 seconds for medium
    } else if (difficulty === "hard") {
        timeLimit = 60; // 60 seconds for hard
    }
    document.getElementById("difficulty-selection").style.display = "none";
    document.getElementById("name-input").style.display = "block";
}
// Function to capture player's name and move to the quiz
function submitName() {
    playerName = document.getElementById("player-name").value;
    if (playerName) {
        document.getElementById("name-input").style.display = "none";
        document.getElementById("quiz").style.display = "block";
        loadQuestions();
        displayQuestion();
    } else{
        alert("Please enter your name to continue.");
    }
}
// Function to load questions based on difficulty
function loadQuestions() {
    questions = generateQuestions(difficulty); // Implement this function based on difficulty
}
function generateQuestions(difficulty) {
    if (difficulty === 'easy') {
        return [
            { question: "What is 5 + 3?", options: [6, 7, 8, 9], answer: 8 },
            { question: "What is 10 - 4?", options: [5, 6, 7, 8], answer: 6 },
            { question: "What is 2 * 3?", options: [5, 6, 7, 8], answer: 6 },
            { question: "What is 4 + 6?", options: [12, 24, 2, 10], answer: 10},
            { question: "What is 7 - 3 + 4?", options: [14, 0, 8, 11], answer: 8},
            
        ];
    } else if (difficulty === 'medium') {
        return [
            { question: "Solve for x: x + y = 10 and x − y = 2", options: [6, 7, 5, 9], answer: 6 },
            { question: "Solve for x: 2x + 3y = 12 and y = 2", options: [10, 6, 3, 8], answer: 3 },
            { question: "Solve for y: 3x + 4y = 24 and x = 4", options: [9, 3, 7, 5], answer: 3 },
            { question: "Solve for x: 5x - 2y = 10 and y = 5", options: [2, 12, 8, 4], answer: 4 },
            { question: "Solve for y: x + 2y = 8 and 2x − y = 6", options: [2, 7, 3, 10], answer: 2 },
            
        ];
    } else if (difficulty === 'hard') {
        return [
            { question: "Solve for x: x^2 - 5x + 6 = 0 (First root)", options: [2, 5, 8, 7], answer: 2 },
            { question: "Solve for x: x^2 - 9 = 0 (First root)", options: [10, 8, 3, 6], answer: 3 },
            { question: "Solve for x: x^2 − 4x + 4 = 0", options: [7, 2, 9, 16], answer: 2 },
            { question: "Solve for x: x^2 + 6x + 9 = 0", options: [-3, 6, 4, 3], answer: -3 },
            { question: "Solve for x : x^2 - x - 12 = 0 (First root)", options: [4, -4, 8, -8], answer: 4 },
            
        ];
    } else{
        alert("Error");
    }
    // Add more question sets for other difficulty levels as needed
    return [];
}
// Function to display the current question
function displayQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        document.getElementById("question-text").innerText = question.question;
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ''; // Clear previous options
        // Create radio buttons for each option
        question.options.forEach((option, index) => {
            const optionLabel = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = "answer";
            optionInput.value = option;
            optionInput.id = `option${index}`;
            optionLabel.htmlFor = `option${index}`;
            optionLabel.innerText = option;
            optionsContainer.appendChild(optionInput);
            optionsContainer.appendChild(optionLabel);
            optionsContainer.appendChild(document.createElement("br"));
        });
        startTimer();
    } else {
        endGame();
    }
}
// Timer function
function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById("time-remaining").innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-remaining").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            score.noAnswer++;
            nextQuestion();
        }
    }, 1000);
}
// Function to submit the answer
function submitAnswer() {
    clearInterval(timerInterval); // Stop the timer for the current question
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const feedbackElement = document.getElementById("feedback");
    if (selectedOption) {
        const answer = parseInt(selectedOption.value);
        // Check if the answer is correct or wrong and show feedback
        if (answer === questions[currentQuestion].answer) {
            score.correct++;
            feedbackElement.innerText = "Correct!";
            feedbackElement.style.color = "green";
        } else {
            score.wrong++;
            feedbackElement.innerText = "Wrong!";
            feedbackElement.style.color = "red";
        }
    } else {
        // No option selected
        score.noAnswer++;
        feedbackElement.innerText = "No answer selected!";
        feedbackElement.style.color = "orange";
    }
    feedbackElement.style.display = "block"; // Show the feedback message
    // Wait 1 second before moving to the next question
    setTimeout(() => {
        feedbackElement.style.display = "none"; // Hide the feedback message
        nextQuestion();
    }, 1000);
}
// Function to move to the next question
function nextQuestion() {
    // Clear any selected radio button for the current question
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        selectedOption.checked = false;
    }
    // Move to the next question
    currentQuestion++;
    // Check if there are more questions
    if (currentQuestion < questions.length) {
        displayQuestion(); // Display the next question
    } else {
        endGame(); // End the game if there are no more questions
    }
}
// Function to end the game and display results
function endGame() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "block";
    const totalQuestions = questions.length;
    const correctAnswers = score.correct;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    // Score breakdown display
    const scoreSummary = `
        <p>Total Questions: ${totalQuestions}</p>
        <p>Correct: ${score.correct}</p>
        <p>Wrong: ${score.wrong}</p>
        <p>No Answer: ${score.noAnswer}</p>
        <p>Your Score: ${correctAnswers} / ${totalQuestions} (${percentageScore.toFixed(2)}%)</p>
    `;
    document.getElementById("score-summary").innerHTML = scoreSummary;
    // Message based on score percentage
    let message;
    if (percentageScore <= 50) {
        message = `Don't worry, ${playerName}, keep practicing and you'll improve!`;
    } else if (percentageScore <= 70) {
        message = `Nice effort, ${playerName}! Keep working to improve your score!`;
    } else if (percentageScore <= 85) {
        message = `Well done, ${playerName}! You're doing great!`;
    } else {
        message = `Excellent work, ${playerName}! You're a math pro!`;
    }
    document.getElementById("score-summary").innerHTML += `<p>${message}</p>`;
}
// Function to restart the game
function restartGame() {
    currentQuestion = 0;
    score = { correct: 0, wrong: 0, noAnswer: 0 };
    document.getElementById("results").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    displayQuestion();
}
// Function to change difficulty
function changeDifficulty() {
    location.reload(); // Reloads the page to start from scratch
}