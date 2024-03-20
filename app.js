const letterBoxes = document.querySelectorAll('.letter-box');
const spiral = document.querySelector('.spiral-container');

const ANSWER_LENGTH = 5;
let currentRow = 0;
let guessLetterArr = [];
let isValidWord;
let wordOfTheDay;

async function init() {
  // Getting wordOfTheDay
  try {
    const response = await axios.get(
      'https://words.dev-apis.com/word-of-the-day'
    );
    wordOfTheDay = response.data.word;
  } catch (error) {
    console.error(error);
  }
  // Hiding the Loading spiral as wordOfTheDay is received
  spiral.classList.add('hidden');

  // Even listener for the entire document
  document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
  const action = e.key;

  if (isLetter(action)) {
    handleLetter(action.toUpperCase());
  } else if (action === 'Enter') {
    handleEnter();
  } else if (action === 'Backspace') {
    handleBackspace();
  } else {
    // do nothing
  }

  console.log(`You pressed ${action}`);
}

function handleLetter(letter) {
  if (guessLetterArr.length < ANSWER_LENGTH) {
    // Add letter to the end
    guessLetterArr.push(letter);
  } else {
    // Replace the last letter
    guessLetterArr.pop();
    guessLetterArr.push(letter);
  }

  // Mind-bending equation tbh
  letterBoxes[
    ANSWER_LENGTH * currentRow + guessLetterArr.length - 1
  ].innerText = letter;
}

async function handleEnter() {
  // Guess word should be 5 characters long
  if (guessLetterArr.length !== ANSWER_LENGTH) return;

  const guessWord = guessLetterArr.join('');

  // Showing the Loading spiral as validating will take a while
  spiral.classList.remove('hidden');

  try {
    const response = await axios.post(
      'https://words.dev-apis.com/validate-word',
      JSON.stringify({
        word: guessWord,
      })
    );
    isValidWord = response.data.validWord;
  } catch (error) {
    console.error(error);
  }
  // Hiding the Loading spiral as validating is finished
  spiral.classList.add('hidden');

  if (isValidWord) {

    // correct
    
    // close

    // wrong


    // new row initiating and guessLetterArr is being reset
    currentRow++;
    guessLetterArr = [];
  } else {
    handleInvalid();
  }
}

function handleBackspace() {
  if (guessLetterArr.length > 0) {
    guessLetterArr.pop();
    letterBoxes[ANSWER_LENGTH * currentRow + guessLetterArr.length].innerText =
      '';
  }
}

function handleInvalid() {
  for (
    let i = ANSWER_LENGTH * currentRow + 0;
    i < ANSWER_LENGTH * currentRow + guessLetterArr.length;
    i++
  ) {
    letterBoxes[i].classList.add('invalid');

    // Removing 'invalid' class after 1s
    setTimeout(function () {
      letterBoxes[i].classList.remove('invalid');
    }, 1000);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

init();
