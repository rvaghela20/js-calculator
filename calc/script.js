const display = document.querySelector('#result-display');
const buttons = document.querySelectorAll('.btn-number, .btn-operator');
const themeToggleBtn = document.querySelector('.theme-toggler');
const calculator = document.querySelector('.calculator');
let isDark = true;
const themeToggleKey = 't'; 
const clearKey = 'c';

const storedTheme = localStorage.getItem('calculatorTheme');
if (storedTheme === 'dark') {
  enableDarkTheme();
} else {
  disableDarkTheme();
}

buttons.forEach((item) => {
  item.onclick = () => {
    handleButtonClick(item.id);
  };
});

themeToggleBtn.onclick = () => {
  toggleTheme();
};

document.addEventListener('keydown', (event) => {
  const key = event.key;
  const validKeys = /[0-9+\-*/.=]|Backspace|Delete|Enter/;

  if (!validKeys.test(key) || key.startsWith('F')) {
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateCurrentExpression();
  } else if (key === 'Backspace' || key === 'Delete') {
    deleteLastCharacter();
  } else {
    display.innerText += key;
  }
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const targetElement = event.target.tagName.toLowerCase();

  if (key === themeToggleKey && targetElement !== 'input') {
    toggleTheme();
  }
  if (key === clearKey && targetElement !== 'input'){
    clearDisplay();
  }
});

function handleButtonClick(id) {
  const currentExpression = display.innerText;

  if (id === 'clear') {
    clearDisplay();
  } else if (id === 'backspace') {
    deleteLastCharacter();
  } else if (id === 'equal') {
    evaluateCurrentExpression();
  } else {
    display.innerText += id;
  }
}

function evaluateCurrentExpression() {
  const currentExpression = display.innerText;

  if (currentExpression !== '') {
    const result = evaluateExpression(currentExpression);
    if (result !== null) {
      display.innerText = currentExpression;
      display.innerText = `= ${result}`;
    } else {
      displayErrorMessage('Invalid Expression');
      setTimeout(() => {
        clearDisplay();
      }, 1000);
    }
  } else {
    displayErrorMessage('Add some Values!');
    setTimeout(() => {
      clearDisplay();
    }, 1000);
  }
}

function evaluateExpression(expression) {
  try {
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    const result = new Function('return ' + sanitizedExpression)();
    return result;
  } catch (error) {
    return null;
  }
}

function clearDisplay() {
  display.innerText = '';
}

function deleteLastCharacter() {
  display.innerText = display.innerText.slice(0, -1);
}

function toggleTheme() {
  if (isDark) {
    disableDarkTheme();
  } else {
    enableDarkTheme();
  }

  isDark = !isDark;
  const selectedTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('calculatorTheme', selectedTheme);
}

function enableDarkTheme() {
  calculator.classList.add('dark');
  themeToggleBtn.classList.add('active');
}

function disableDarkTheme() {
  calculator.classList.remove('dark');
  themeToggleBtn.classList.remove('active');
}

function displayErrorMessage(message) {
  display.innerText = message;
}
