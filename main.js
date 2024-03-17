import { ctr } from "./centroid";

// DOM elements
const videoObj = document.getElementById("videoElement");
const toggleStreamButton = document.getElementById("toggleStream");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const canvas2d = document.getElementById("canvas2d");

// Variables
let stream = null;
let detector = null;


const initializationFunction = async () => {
  const detectorConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.75
  };
  detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);  
} 

initializationFunction();

// Constraints for video stream
const constraints = {
    video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
    },
};

// Event listeners
toggleStreamButton.addEventListener("click", toggleStream);
startRecordingButton.addEventListener("click", startRecording);
stopRecordingButton.addEventListener("click", stopRecording);



// Function to toggle video stream
async function toggleStream() {
    if (stream) {
        stopStream();
    } else {
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleStream(stream);
            startRecordingButton.disabled = false;
            requestAnimationFrame(processVideoFrame); // Start processing frames
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    }
}

// Function to handle video stream
function handleStream(stream) {
    videoObj.srcObject = stream;
}

// Function to stop video stream
function stopStream() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoObj.srcObject = null;
        stream = null;
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = true;
    }
}

// Function to process video frames for pose detection
function processVideoFrame() {
    if (!stream) return; // Check if stream is available
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // Ensure canvas dimensions are set correctly before drawing
    if (videoObj.videoWidth && videoObj.videoHeight) {
        canvas.width = videoObj.videoWidth;
        canvas.height = videoObj.videoHeight;
        context.drawImage(videoObj, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        detectPoses(imageData);
    }
    requestAnimationFrame(processVideoFrame); // Continuously process frames
}

// Function to detect poses in an image
async function detectPoses(imageData) {
    if (!detector) {
        console.log("Model not loaded yet!");
        return;
    }
    try {
      const estimationConfig = {
        maxPoses: 5,
        flipHorizontal: false,
        scoreThreshold: 0.5,
        nmsRadius: 20
      };
      const poses = await detector.estimatePoses(imageData, estimationConfig);
      drawPoses(poses[0])
    } catch (error) {
        console.error('Error detecting poses:', error);
    }
}

// Function to draw detected poses on the canvas
function drawPoses(poses) {
    const ctx = canvas2d.getContext('2d');
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height); // Clear the canvas
    ctx.strokeStyle = "red"; // Set stroke color
    ctx.lineWidth = 2; // Set line width

    // Draw keypoints
    for (const keypoint of poses.keypoints) {
        ctx.beginPath();
        ctx.arc(keypoint.x / 4.25, keypoint.y / 4.5, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw skeleton
    

    // Calculate the centroid
    let centroidX = 0;
    let centroidY = 0;
    for (const keypoint of poses.keypoints) {
        centroidX += keypoint.x;
        centroidY += keypoint.y;
    }
    centroidX /= poses.keypoints.length;
    centroidY /= poses.keypoints.length;
    ctr.setter(centroidX, centroidY);
    // Draw centroid
    ctx.fillStyle = "blue"; // Set fill color for centroid
    ctx.beginPath();
    ctx.arc(centroidX / 4.25, centroidY / 4.5, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

