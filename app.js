const letterBoxes = document.querySelectorAll('.letter-box');
const spiral = document.querySelector('.spiral-container');
const h1 = document.querySelector('header h1');

const ANSWER_LENGTH = 5;
let currentRow = 0;
let guessLetterArr = [];
let guessWord;
let isValidWord;
let wordOfTheDay;
let wordLetterArr = [];

async function init() {
  // Getting wordOfTheDay
  try {
    const response = await axios.get(
      'https://words.dev-apis.com/word-of-the-day'
    );
    wordOfTheDay = response.data.word.toUpperCase();
  } catch (error) {
    console.error(error);
  }
  // Hiding the Loading spiral as wordOfTheDay is received
  hideLoadingSpiral(true);

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
  // currentRow shouldn't be higher than 5
  if (currentRow > 5) return;
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

  guessWord = guessLetterArr.join('');
  wordLetterArr = wordOfTheDay.split('');

  // Showing the Loading spiral as validating will take a while
  hideLoadingSpiral(false);
  try {
    const response = await axios.post(
      'https://words.dev-apis.com/validate-word',
      {
        word: guessWord,
      }
    );
    isValidWord = response.data.validWord;
  } catch (error) {
    console.error(error);
  }
  // Hiding the Loading spiral as validating is finished
  hideLoadingSpiral(true);

  if (isValidWord) {
    handleValid();
  } else {
    handleInvalid();
  }
}
function handleValid() {
  // correct
  if (wordOfTheDay === guessWord) {
    handleCorrect();
    return;
  }

  // partial correct and close
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    // correct
    if (wordLetterArr[i] === guessLetterArr[i]) {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('correct');
      // Making wordLetterArr && guessLetterArr index's value disable
      wordLetterArr[i] = null;
      guessLetterArr[i] = null;
    } // Close
    else if (guessLetterArr.includes(wordLetterArr[i])) {
      // As guessLetterArr and letterBoxes talk to each other
      // getting guessLetterArr index to use that on letterBoxes
      const index = guessLetterArr.indexOf(wordLetterArr[i]);
      letterBoxes[ANSWER_LENGTH * currentRow + index].classList.add('close');
      // Making wordLetterArr && guessLetterArr index's value disable
      guessLetterArr[index] = null;
      wordLetterArr[i] = null;
    }
  }
  // wrong
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    // Ignore the null(s) in guessLetterArr
    // because null(s) are already marked
    if (!wordLetterArr.includes(guessLetterArr[i]) && guessLetterArr[i]) {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('wrong');
    }
  }

  console.log(guessLetterArr);
  console.log(wordLetterArr);

  // new row initiating and guessLetterArr is being reset
  currentRow++;
  guessLetterArr = [];
}

function handleCorrect() {
  // Adding winner class to the header
  h1.classList.add('winner');
  // Adding colors to the boxes in the row
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('correct');
  }
  // Removing Event Listener
  document.removeEventListener('keydown', handleKeyPress);
}

function handleInvalid() {
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('invalid');

    // Removing 'invalid' class after 1s
    setTimeout(function () {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.remove('invalid');
    }, 1000);
  }
}

function handleBackspace() {
  if (guessLetterArr.length > 0) {
    guessLetterArr.pop();
    letterBoxes[ANSWER_LENGTH * currentRow + guessLetterArr.length].innerText =
      '';
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function hideLoadingSpiral(bool) {
  spiral.classList.toggle('hidden', bool);
}

init();
