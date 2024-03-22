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
    wordLetterArr = wordOfTheDay.split('');
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
  // Mapping for wordLetterArr to keep track of the letters
  const wordLetterMap = makeMap(wordLetterArr);

  // correct
  if (wordOfTheDay === guessWord) {
    handleCorrect();
    return;
  }

  // partial correct
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    // correct
    if (wordLetterArr[i] === guessLetterArr[i]) {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('correct');
      wordLetterMap[guessLetterArr[i]]--;
    }
  }
  // Close and wrong
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    let letter = guessLetterArr[i];
    if (wordLetterArr[i] === guessLetterArr[i]) {
      // Already handled this case, so DO NOTHING
    }
    // Close
    else if (wordLetterArr.includes(letter) && wordLetterMap[letter] > 0) {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('close');
      wordLetterMap[letter]--;
    }
    // wrong
    else {
      letterBoxes[ANSWER_LENGTH * currentRow + i].classList.add('wrong');
    }
  }
  // new row initiating and guessLetterArr is being reset
  currentRow++;
  guessLetterArr = [];
}

function handleCorrect() {
  alert('You win! 🙂');
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

function makeMap(arr) {
  return arr.reduce((obj, curValue) => {
    obj[curValue] ? obj[curValue]++ : (obj[curValue] = 1);
    return obj;
  }, {});
}

function hideLoadingSpiral(bool) {
  spiral.classList.toggle('hidden', bool);
}

init();
