import initMixin from "./initMixin";
import initHTML from "./initHTML"
import initCamera from "./initCamera"
function Camera(options) {
    this._init(options);
    this._camera()
}

initMixin(Camera);
initHTML(Camera);
initCamera(Camera);
export default Camera;
