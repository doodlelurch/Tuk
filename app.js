let tallyCount = 0;
const tallyDisplay = document.getElementById('tally');
const startButton = document.getElementById('start-btn');

// Check if the browser supports speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if ('SpeechRecognition' in window) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        
        // Check if the word "tuk" is heard
        if (transcript.includes('tuk')) {
            tallyCount++;
            tallyDisplay.textContent = `Tally: ${tallyCount}`;
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };

    // Start listening when the button is clicked
    startButton.addEventListener('click', () => {
        recognition.start();
        startButton.textContent = "Listening...";
        startButton.disabled = true;
    });
    
} else {
    alert('Your browser does not support speech recognition. Please try Chrome or another compatible browser.');
}