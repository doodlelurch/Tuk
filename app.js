let tallyCount = 0;
const tallyDisplay = document.getElementById('tally');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const outputBox = document.getElementById('output-box');

// Initialize variables for recording
let mediaRecorder;
let audioChunks = [];

// AssemblyAI API key
const API_KEY = '430f22c13c6b401e965a12c7ff520023';  // Replace with your AssemblyAI API key

// Start recording audio
startButton.addEventListener('click', async () => {
    audioChunks = [];
    startButton.disabled = true;
    stopButton.disabled = false;

    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    stopButton.addEventListener('click', async () => {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioBase64 = await blobToBase64(audioBlob);

        // Send the audio to AssemblyAI for transcription
        const transcript = await sendToAssemblyAI(audioBase64);
        handleTranscript(transcript);
    });
});

// Function to convert Blob to base64
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
    });
}

// Send the audio to AssemblyAI for transcription
async function sendToAssemblyAI(audioBase64) {
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
            'authorization': API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ audio_data: audioBase64 })
    });

    const result = await response.json();
    const transcriptId = result.upload_url;

    // Poll AssemblyAI for transcription results
    const transcription = await pollForTranscript(transcriptId);
    return transcription;
}

// Poll AssemblyAI until the transcript is ready
async function pollForTranscript(transcriptId) {
    let completed = false;
    let transcript = '';

    while (!completed) {
        const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
            headers: { 'authorization': API_KEY }
        });
        const result = await response.json();

        if (result.status === 'completed') {
            completed = true;
            transcript = result.text;
        } else if (result.status === 'failed') {
            completed = true;
            alert('Transcription failed');
        }

        // Wait for 2 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return transcript;
}

// Handle the transcript and update tally
function handleTranscript(transcript) {
    outputBox.textContent = `Heard: ${transcript}`;
    
    const wordsToMatch = ['tuk', 'tuk tuk', 'took', 'tuck'];
    
    if (wordsToMatch.some(word => transcript.toLowerCase().includes(word))) {
        tallyCount++;
        tallyDisplay.textContent = `Tally: ${tallyCount}`;
    }
}