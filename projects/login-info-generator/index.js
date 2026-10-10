// Digits (0-9)
const digits = Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i));

// Uppercase letters (A-Z)
const uppercaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// Lowercase letters (a-z)
const lowercaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

// All letters and digits
const allCharactersWithoutSymbols = [
  ...digits,
  ...uppercaseLetters,
  ...lowercaseLetters
];

// All letters
const allLetters = [
  ...uppercaseLetters,
  ...lowercaseLetters
];

// Standard symbols and punctuation (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)
const asciiSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'.split('');

// All printable ASCII characters combined (94 characters)
const allCharacters = [
  ...digits,
  ...uppercaseLetters,
  ...lowercaseLetters,
  ...asciiSymbols
];

function randomCharacter(includeSymbols) {
    if (includeSymbols) {
        return allCharacters[Math.floor(Math.random() * allCharacters.length)];
    } else {
        return allCharactersWithoutSymbols[Math.floor(Math.random() * allCharactersWithoutSymbols.length)];
    }
}

function randomDigit() {
    return digits[Math.floor(Math.random() * digits.length)];
}

function randomLetter() {
    return allLetters[Math.floor(Math.random() * allLetters.length)];
}

async function loadCommonWords() {
    // Pulls the raw list directly from GitHub
    const response = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt');
    const text = await response.text();
    
    // Splits into an array of 10,000 clean words
    const commonWords = text.split(/\r?\n/);
    
    return commonWords;
}

let commonWords = [];

loadCommonWords().then(words => {
    commonWords = words;
});

function randomCommonWord() {
    return commonWords[Math.floor(Math.random() * commonWords.length)];
}


// Random Username
const randomUsernameInputs = {
    generate: document.getElementById('generate-random-username'),
    randomUsername: document.getElementById('random-username-list'),
    includeNumber: document.getElementById('include-number-random-username'),
    numOfDigits: document.getElementById('number-digits-amount-random-username'),
    wordCount: document.getElementById('wordcount-random-username'),
    wordSeparator: document.getElementById('word-separator-random-username')
}

randomUsernameInputs.generate.addEventListener('click',
function () {
    let username = '';
    const includeNumber = randomUsernameInputs.includeNumber.checked;
    const numOfDigits = randomUsernameInputs.numOfDigits.value;
    const wordCount = randomUsernameInputs.wordCount.value;
    const wordSeparator = randomUsernameInputs.wordSeparator.value;

    for (let i = 0; i < wordCount; i++) {
        username += randomCommonWord();
        if (i < wordCount - 1) {
            username += wordSeparator;
        }
    }

    if (includeNumber) {
        for (let i = 0; i < numOfDigits; i++) {
            username += randomDigit();
        }
    }

    randomUsernameInputs.randomUsername.textContent = username;
});

randomUsernameInputs.numOfDigits.addEventListener('change', function () {
    const numOfDigits = randomUsernameInputs.numOfDigits.value;
    const labelPluralEnd = document.getElementById('number-digits-amount-random-username-label-plural-end');

    if (numOfDigits == 1) {
        labelPluralEnd.textContent = '';
    } else {
        labelPluralEnd.textContent = 's';
    }
});


// Random Password
const randomPasswordInputs = {
    generate: document.getElementById('generate-random-password'),
    randomPassword: document.getElementById('random-password-list'),
    includeSymbols: document.getElementById('include-symbols-random-password'),
    includeDigits: document.getElementById('include-digits-random-password'),
    length: document.getElementById('length-random-password')
}

randomPasswordInputs.includeDigits.addEventListener('change', function () {
    const includeDigits = randomPasswordInputs.includeDigits.checked;

    if (includeDigits) {
        randomPasswordInputs.includeSymbols.disabled = false;
    } else {
        randomPasswordInputs.includeSymbols.checked = false;
        randomPasswordInputs.includeSymbols.disabled = true;
    }
});

randomPasswordInputs.generate.addEventListener('click', function () {
    let password = '';
    const includeSymbols = randomPasswordInputs.includeSymbols.checked;
    const includeDigits = randomPasswordInputs.includeDigits.checked;
    const length = randomPasswordInputs.length.value;

    for (let i = 0; i < length; i++) {
        if (includeDigits) {
            password += randomCharacter(includeSymbols);
        } else {
            password += randomLetter();
        }
    }

    randomPasswordInputs.randomPassword.textContent = password;
});