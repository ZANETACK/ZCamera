export default function (Camera) {
    Camera.prototype._html = function () {
        const vm = this;
        vm.$el.innerHTML = `<video id="camera-video"></video>`;
        vm.$cameraVideo = document.querySelector('#camera-video');
    }
}
