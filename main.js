// Import the word map from the external language.js file
import { wordMap } from './language.js';

// Function to reverse the word map (flip key-value pairs)
function reverseWordMap() {
    return Object.fromEntries(
        Object.entries(wordMap).map(([key, value]) => [value, key])
    );
}

// Set the initial current word map to the original
let currentWordMap = wordMap;

// Function to transform text
function transformText() {
    const inputText = document.getElementById('inputText').value;
    const words = inputText.split(/\s+/); // Split input into words

    // Map words to transformed versions or keep them unchanged if not found in word map
    const transformedWords = words.map(word => {
    if (word.trim() === '') {
        return ''; // Ignore empty or whitespace-only entries
    }

    const originalWord = word;
    const lowerWord = word.toLowerCase();

    // Preserve case style: all caps, title case, or lowercase
    const preserveCase = (translated, original) => {
        if (original === original.toUpperCase()) {
            return translated.toUpperCase();
        } else if (original[0] === original[0].toUpperCase()) {
            return translated[0].toUpperCase() + translated.slice(1);
        } else {
            return translated;
        }
    };

    if (currentWordMap === wordMap) {
        let isPlural = false;
        let baseWord = lowerWord;

        if (lowerWord.endsWith('s')) {
            const singular = lowerWord.slice(0, -1);
            if (currentWordMap.hasOwnProperty(singular)) {
                baseWord = singular;
                isPlural = true;
            }
        }

        if (currentWordMap.hasOwnProperty(baseWord)) {
            const translated = currentWordMap[baseWord];
            const result = isPlural ? translated + 'qa' : translated;
            return preserveCase(result, originalWord);
        } else {
            return originalWord;
        }
    } else {
        let isPlural = false;
        let baseWord = lowerWord;

        if (lowerWord.endsWith('qa')) {
            baseWord = lowerWord.slice(0, -2);
            isPlural = true;
        }

        if (currentWordMap.hasOwnProperty(baseWord)) {
            const translated = currentWordMap[baseWord];
            const result = isPlural ? translated + 's' : translated;
            return preserveCase(result, originalWord);
        } else {
            return originalWord;
        }
    }
});



    // Join transformed words (ignoring empty results) and output to the second textarea
    document.getElementById('outputText').value = transformedWords.filter(w => w !== '').join(' ');

    // Update the character count display (current characters / 9999)
    const characterCount = inputText.replace(/\s/g, '').length; // Count characters, ignoring spaces
    document.querySelector('.code_length').textContent = `${characterCount}/9999`;
}


// Add an event listener to the input textarea to update the output and character count in real time
document.getElementById('inputText').addEventListener('input', transformText);

///////////////////////////////////////////////////////////////

// Copy the content of the input textarea
document.getElementById('copyInput').addEventListener('click', function() {
    const inputText = document.getElementById('inputText');
    inputText.select();
    document.execCommand('copy'); // Copy the selected text
});

// Copy the content of the output textarea
document.getElementById('copyOutput').addEventListener('click', function() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    document.execCommand('copy'); // Copy the selected text
});

/////////////////////////////////////////////////////////////

// Function to swap the values of both text areas
function swapText() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    
    // Swap the content of the textareas
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;
}

// Get the elements for language selection and swapping
const select1 = document.getElementById('languageSelect1');
const select2 = document.getElementById('languageSelect2');
const swapLangButton = document.getElementById('switchLang');

// Function to swap the selected values of the two select elements and swap the text
swapLangButton.addEventListener('click', () => {
    // Get the selected option values from both select elements
    let select1Value = select1.value;
    let select2Value = select2.value;
    
    // Ensure select1 and select2 values are not the same
    if (select1Value === select2Value) {
        // Alert user or reset one of the selects to a different value
        alert("The selected languages cannot be the same! Please choose different languages.");
        return; // Prevent further action if they are the same
    }

    // Swap the values
    select1.value = select2Value;
    select2.value = select1Value;

    // Flip the current word map based on the selected language
    if (select1.value === 'eng' || select2.value === 'lal') {
        currentWordMap = wordMap; // Use original word map
    } else {
        currentWordMap = reverseWordMap(); // Use reversed word map
    }

    // Swap the content of the textareas first
    swapText();

    // Now that the content has been swapped, apply the transformation
    transformText();
});
