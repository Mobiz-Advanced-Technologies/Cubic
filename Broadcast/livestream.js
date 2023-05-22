function startLiveStream() {
    const receiverWindow = window.open('receiver.html', 'popup', 'popup=true');

    receiverWindow.addEventListener('load', function () {
        const receiverVideo = receiverWindow.document.getElementById('receiver-video');
        const canvasStream = canvas.captureStream();
        const canvasTrack = canvasStream.getVideoTracks()[0];
        const canvasMediaStream = new MediaStream([canvasTrack]);

        receiverVideo.srcObject = canvasMediaStream;
        receiverVideo.play();
    });
}