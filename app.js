let tallyCount = 0;
const tallyDisplay = document.getElementById('tally');
const startButton = document.getElementById('start-btn');

// Check if the browser supports speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if ('SpeechRecognition' in window) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';  // Adjust if needed for your language or accent

    recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        
        console.log('Heard: ', transcript);  // Log what the app hears

        // Words or phrases to match
        const wordsToMatch = ['tuk', 'tuk tuk', 'took', 'tuck'];

        // Check if any of the words is included in the transcript
        if (wordsToMatch.some(word => transcript.includes(word))) {
            tallyCount++;
            tallyDisplay.textContent = `Tally: ${tallyCount}`;
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };

    // Start listening when the button is clicked
    startButton.addEventListener('click', () => {
        try {
            recognition.start();
            startButton.textContent = "Listening...";
            startButton.disabled = true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            alert('Failed to start speech recognition. Please try a different browser.');
        }
    });

} else {
    console.error('SpeechRecognition API not supported on this browser.');
    alert('Your browser does not support speech recognition. Please try Chrome or another compatible browser.');
}