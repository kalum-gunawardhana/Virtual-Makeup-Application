const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusDiv = document.getElementById("status");

let model;

// Load the COCO-SSD model
async function loadModel() {
  statusDiv.textContent = "Loading model...";
  model = await cocoSsd.load();
  statusDiv.textContent = "Model loaded! Upload an image to start detecting.";
}

loadModel();

// Handle image upload
imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      statusDiv.textContent = "Detecting objects...";
      const predictions = await model.detect(canvas);
      drawPredictions(predictions);
    };
    img.src = URL.createObjectURL(file);
  }
});

// Draw predictions
function drawPredictions(predictions) {
  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`;

    // Draw bounding box
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw label background
    ctx.fillStyle = "red";
    ctx.fillRect(x, y - 20, ctx.measureText(text).width + 10, 20);

    // Draw label text
    ctx.fillStyle = "white";
    ctx.fillText(text, x + 5, y - 5);
  });

  statusDiv.textContent = "Detection complete!";
}

const video = document.createElement("video");
video.width = 640;
video.height = 480;
document.body.appendChild(video);

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();

  video.addEventListener("loadeddata", () => detectFromVideo(video));
}

async function detectFromVideo(video) {
  const predictions = await model.detect(video);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  drawPredictions(predictions);
  requestAnimationFrame(() => detectFromVideo(video));
}

startCamera();
