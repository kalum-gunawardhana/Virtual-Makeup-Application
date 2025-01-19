const webcam = document.getElementById('webcam');
const overlay = document.getElementById('overlay');
const emotionDisplay = document.getElementById('emotion');
const ctx = overlay.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = stream;
}

async function detectEmotion() {
  const model = await blazeface.load();
  
  setInterval(async () => {
    const predictions = await model.estimateFaces(webcam, false);

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.boundingBox;
      ctx.strokeRect(x, y, width, height);

      // Placeholder for emotion detection logic
      const emotion = "Happy"; // Replace with actual emotion model result
      ctx.fillText(emotion, x, y - 10);
      emotionDisplay.innerText = emotion;
    });
  }, 100);
}

setupCamera().then(detectEmotion);