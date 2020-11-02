export default function (Camera) {
    Camera.prototype._camera = function () {
        const vm = this;
    }
    Camera.prototype._newOpenCamera = function () {
        const vm = this;
        vm.newMedia.getUserMedia(vm.$options.mediaOptions).then(stream => {
            vm.console && console.info('Camera提醒：你正在使用新版本浏览器调用摄像头')
            vm._handleStream(stream)
        }).catch(function (error) {
            if(vm.openReject)vm.openReject({status: 'openError', error})
        });
    }
    
    Camera.prototype._oldOpenCamera = function () {
        const vm = this;
        try {
            vm.oldMedia(vm.$options.mediaOptions, function (stream) {
                vm.console && console.info('Camera提醒：你正在使用老版本浏览器调用摄像头,为了保证质量请切换到谷歌新版本浏览器')
                vm._handleStream(stream)
            }, function (error) {
                if(vm.openReject)vm.openReject({status: 'openError', error})
            });
        } catch (e) {
            vm.console && console.warn('Camera提醒：你的浏览器版本过低，请切换到谷歌新版本浏览器')
        }
    }
    
    Camera.prototype._onloadedmetadata = function () {
        const vm = this;
        vm.$cameraVideo.play();
        vm._setOpen(true);
        vm._setLoading(false);
    }
    
    Camera.prototype._handleStream = function (stream) {
        const vm = this;
        if (vm.$cameraVideo) {
            if ('srcObject' in vm.$cameraVideo) {
                vm.$cameraVideo.srcObject = stream;
            } else {
                //新版本已经废弃
                vm.$cameraVideo.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            vm.$cameraVideo.onloadedmetadata = vm._onloadedmetadata.apply(vm);
        }
        vm.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
        if (vm.openResolve) {
            vm.openResolve({status: 'opened'})
        }
    }
    
    Camera.prototype._setLoading = function (bool) {
        const vm = this;
        vm.$options.isLoading = bool;
        if (!bool && this.$options.stop) {
            vm.$options.stop(vm)
        }
    }
    
    Camera.prototype._setOpen = function (bool) {
        this.$options.isOpen = bool;
    }
    
    /**************外部api**************/
    Camera.prototype.open = function () {
        const vm = this;
        return new Promise((resolve, reject) => {
            vm.openResolve = resolve;
            vm.openReject = reject;
            vm._html();
            vm._setLoading(true);
            if (vm.newMedia && vm.newMedia.getUserMedia) {
                vm._newOpenCamera()
            } else if (vm.oldMedia) {
                vm._oldOpenCamera()
            }
        })
    }
    
    Camera.prototype.stop = function () {
        const vm = this;
        return new Promise(resolve => {
           try{
               vm.mediaStreamTrack && vm.mediaStreamTrack.stop();
               vm._setOpen(false);
               vm._setLoading(false);
               vm.$el.removeChild(vm.$cameraVideo);
           }catch (e) {}
            resolve({status: 'stopOver'})
        })
    }
    
    Camera.prototype.cut = function () {
        const vm = this;
        return new Promise((resolve, reject) => {
            if(!vm.$options.isOpen){
                reject({status: 'cutError'})
            }else{
                const canvas = document.createElement('canvas');
                const width = vm.$cameraVideo.videoWidth;
                const height = vm.$cameraVideo.videoHeight;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(vm.$cameraVideo, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/png');
                resolve(base64)
            }
        })
    }
    
    Camera.prototype.getMedia = function () {
        return this.mediaStreamTrack
    }
    
}
