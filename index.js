$(document).ready(function(){
  var currentQuestion;
  var interval;
  var timeLeft = 10;
  var score = 0;
  var highScore = 0; 
  var numberLimit = 10; 
  var operations = ["+"]; 

  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  };

  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
    if (score > highScore) {
      highScore = score; 
      $('#high-score').text(highScore);
    }
  };

  var startGame = function () {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score); 
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);  
    }
  };

  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  var questionGenerator = function () {
    var question = {};
    var num1 = randomNumberGenerator(numberLimit); 
    var num2 = randomNumberGenerator(numberLimit);
    
    var operation = operations[Math.floor(Math.random() * operations.length)];
  
    if (operation === "+") {
      question.answer = num1 + num2;
      question.equation = String(num1) + " + " + String(num2);
    } else if (operation === "-") {
      if (num1 < num2) {
        num1 = num2 + randomNumberGenerator(numberLimit); 
      }
      question.answer = num1 - num2;
      question.equation = String(num1) + " - " + String(num2);
    } else if (operation === "*") {
      question.answer = num1 * num2;
      question.equation = String(num1) + " * " + String(num2);
    } else if (operation === "/") {
      if (num2 === 0) {
        num2 = 1; 
      }
      num1 = num2 * randomNumberGenerator(numberLimit); 
      question.answer = num1 / num2; 
      question.equation = String(num1) + " / " + String(num2);
    }
    
    return question;
  };
  
  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);  
  };

  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val(''); 
      updateTimeLeft(+1);
      updateScore(+1); 
    }
  };

  var updateOperations = function () {
    operations = [];
    if ($('#addition').is(':checked')) operations.push("+");
    if ($('#subtraction').is(':checked')) operations.push("-");
    if ($('#multiplication').is(':checked')) operations.push("*");
    if ($('#division').is(':checked')) operations.push("/");
  };

  $('#number-limit').on('input', function () {
    numberLimit = $(this).val();
    $('#number-limit-display').text(numberLimit);
  });

  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  $('input[type="checkbox"]').on('change', function () {
    updateOperations();
  });

  renderNewQuestion();
  updateOperations();
});
