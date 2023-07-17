var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var video = document.createElement('video');
var overlayImg = document.createElement('img');
var overlayMode = false;

document.documentElement.appendChild(video)

video.setAttribute("autoplay", "true");
let mediaRecorder;
let recordedChunks = [];

function recordCanvas(canvas) {
    document.getElementById('startRecordBtn').style.display = "none";
    document.getElementById('stopRecordBtn').style.display = "inline-block";

    const stream = canvas.captureStream();
    const videoStream = video.captureStream();

    const combinedStream = new MediaStream([...stream.getTracks(), ...videoStream.getTracks()]);
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=h264' });

    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formattedToday}.webm`;
        link.click();

        recordedChunks = [];
    };

    mediaRecorder.start();
}

function stopRecording() {
    document.getElementById('startRecordBtn').style.display = "inline-block";
    document.getElementById('stopRecordBtn').style.display = "none";
    
    mediaRecorder.stop();
}

//fetch saved overlays
if (!localStorage.getItem("overlays")) {
    var overlaylist = [];
} else {
    var overlaylist = JSON.parse(localStorage.getItem("overlays"));
}

//load saved overlays
function loadSavedOverlays() {
    var savedelementlist = document.getElementById("presetlist");
    savedelementlist.innerHTML = "";

    overlaylist.forEach(element => {
        let presetlist = document.getElementById("presetlist");
        let option = document.createElement("option");
        option.innerText = element.overlayName || "Overlay";

        presetlist.prepend(option)

        option.onclick = function () {
            options.elements = element;
            refreshUIElements()
        }
    });
}
loadSavedOverlays()

function exportOverlay() {
    const blob = new Blob([JSON.stringify(options.elements)], { type: "application/json" });
    const fileName = "overlay.json";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
}

function loadOverlay() {
    var input = document.getElementById("file-input");
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        options.elements = JSON.parse(contents);
    };

    reader.readAsText(file);
}

//overlay configuration
const options = {
    width: 360,
    height: 360,
    rate: 1,
    elements: []
};

//function to save an overlay to localstorage
function saveOverlay() {
    overlaylist.push(options.elements);
    localStorage.setItem("overlays", JSON.stringify(overlaylist))

    loadSavedOverlays()
}

video.addEventListener('play', function () {
    var $this = this; //cache
    var lastTime = performance.now();
    var frameCounter = 0;
    var fpsCounter = 0;

    //video rendering
    function loop() {
        if (!$this.paused && !$this.ended) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            options.width = video.videoWidth;
            options.height = video.videoHeight;

            ctx.drawImage($this, 0, 0);
            ctx.drawImage(overlayImg, 0, 0);

            frameCounter++;

            var currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                fpsCounter = frameCounter;
                frameCounter = 0;
                lastTime = currentTime;
                document.getElementById('FPSMark').innerText = ('FPS:' + fpsCounter);
            }
        }
    }


    //overlay rendering
    async function drawOverlays() {
        if (options.elements.length === 0) {
            overlayMode = false;
        } else {
            overlayMode = true;
        }

        if (!$this.paused && !$this.ended && overlayMode) {
            let ui = await simple2canvas(options);
            overlayImg.src = ui.toDataURL();
        }
    }

    audioTimerLoop(loop, 0)
    audioTimerLoop(drawOverlays, 0)

}, 0);

function startRecording() {
    // FIX: Add audio for gaming streams that require audio
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error('Error getting screen media: ', err);
        });
}

function custom_video(event) {
    var reader = new FileReader();
    reader.onload = function () {
        video.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

//insane borrowed code from stackoverflow
function audioTimerLoop(callback, frequency) {
  var freq = frequency / 1000;
  var aCtx = new AudioContext();

  var silence = aCtx.createGain();
  silence.gain.value = 0;
  silence.connect(aCtx.destination);

  onOSCend();

  var stopped = false;
  function onOSCend() {
    var osc = aCtx.createOscillator();
    osc.onended = onOSCend;
    osc.connect(silence);
    osc.start(0);
    osc.stop(aCtx.currentTime + freq);
    callback(aCtx.currentTime);
    if (stopped) {
      osc.onended = function() {
        aCtx.close();
        return;
      };
    }
  };

  return function() {
    stopped = true;
  };
}