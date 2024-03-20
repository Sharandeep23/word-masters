const letterBoxes = document.querySelectorAll('.letter-box');
const spiral = document.querySelector('.spiral');
const ANSWER_LENGTH = 5;
const guessLetterArr = [];
let wordOfTheDay;

async function init() {
  // Getting wordOfTheDay
  try {
    const response = await axios.get(
      'https://words.dev-apis.com/word-of-the-day'
    );
    // Hiding the spiral as wordOfTheDay is retrieved
    spiral.classList.add('hidden');
    wordOfTheDay = response.data.word;
    console.log(`The Word of the day: ${wordOfTheDay}`);
  } catch (error) {
    console.error(error);
  }

  // Even listener for the document
  document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
  const action = e.key;

  if (isLetter(action)) {
    handleLetter(action.toUpperCase());
  } else if (action === 'Enter') {
    // handleEnter();
  } else if (action === 'Backspace') {
    // handleBackspace();
  } else {
    // do nothing
  }

  console.log(`You pressed ${action}`);
}

function handleLetter(letter) {
  if (guessLetterArr.length < ANSWER_LENGTH) {
    guessLetterArr.push(letter);
  } else {
    guessLetterArr.pop();
    guessLetterArr.push(letter);
  }

  letterBoxes[guessLetterArr.length - 1].innerText = letter;
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

init();
