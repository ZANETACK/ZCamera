export default function (Camera) {
    Camera.prototype._init = function (options) {
        const vm = this;
        //初始化配置
        vm.$options = {
            isOpen: false,
            isLoading: false,
            //相机的配置
            mediaOptions: {
                audio: true,
                video: {
                    width: 640,
                    height: 360
                }
            }
        }
        Object.assign(vm.$options, options);
        
        //创建元素
        vm.$el = document.querySelector(options.el);
       
        //创建相机API
        //获取媒体方法（旧方法）
        vm.oldMedia =  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
        //获取媒体方法（新方法）
        vm.newMedia = navigator.mediaDevices;
    }
}
