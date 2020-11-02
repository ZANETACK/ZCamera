(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ZCamera = factory());
}(this, (function () { 'use strict';

    function initMixin (Camera) {
      Camera.prototype._init = function (options) {
        var vm = this; //初始化配置

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
        };
        Object.assign(vm.$options, options); //创建元素

        vm.$el = document.querySelector(options.el); //创建相机API
        //获取媒体方法（旧方法）

        vm.oldMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia; //获取媒体方法（新方法）

        vm.newMedia = navigator.mediaDevices;
      };
    }

    function initHTML (Camera) {
      Camera.prototype._html = function () {
        var vm = this;
        vm.$el.innerHTML = "<video id=\"camera-video\"></video>";
        vm.$cameraVideo = document.querySelector('#camera-video');
      };
    }

    function initCamera (Camera) {
      Camera.prototype._camera = function () {
      };

      Camera.prototype._newOpenCamera = function () {
        var vm = this;
        vm.newMedia.getUserMedia(vm.$options.mediaOptions).then(function (stream) {
          console.info('Camera提醒：你正在使用新版本浏览器调用摄像头');

          vm._handleStream(stream);
        })["catch"](function (error) {
          if (vm.openReject) vm.openReject({
            status: 'openError',
            error: error
          });
        });
      };

      Camera.prototype._oldOpenCamera = function () {
        var vm = this;

        try {
          vm.oldMedia(vm.$options.mediaOptions, function (stream) {
            console.info('Camera提醒：你正在使用老版本浏览器调用摄像头,为了保证质量请切换到谷歌新版本浏览器');

            vm._handleStream(stream);
          }, function (error) {
            if (vm.openReject) vm.openReject({
              status: 'openError',
              error: error
            });
          });
        } catch (e) {
          console.warn('Camera提醒：你的浏览器版本过低，请切换到谷歌新版本浏览器');
        }
      };

      Camera.prototype._onloadedmetadata = function () {
        var vm = this;
        vm.$cameraVideo.play();

        vm._setOpen(true);

        vm._setLoading(false);
      };

      Camera.prototype._handleStream = function (stream) {
        var vm = this;

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
          vm.openResolve({
            status: 'opened'
          });
        }
      };

      Camera.prototype._setLoading = function (bool) {
        var vm = this;
        vm.$options.isLoading = bool;

        if (!bool && this.$options.stop) {
          vm.$options.stop(vm);
        }
      };

      Camera.prototype._setOpen = function (bool) {
        this.$options.isOpen = bool;
      };
      /**************外部api**************/


      Camera.prototype.open = function () {
        var vm = this;
        return new Promise(function (resolve, reject) {
          vm.openResolve = resolve;
          vm.openReject = reject;

          vm._html();

          vm._setLoading(true);

          if (vm.newMedia && vm.newMedia.getUserMedia) {
            vm._newOpenCamera();
          } else if (vm.oldMedia) {
            vm._oldOpenCamera();
          }
        });
      };

      Camera.prototype.stop = function () {
        var vm = this;
        return new Promise(function (resolve) {
          try {
            vm.mediaStreamTrack && vm.mediaStreamTrack.stop();

            vm._setOpen(false);

            vm._setLoading(false);

            vm.$el.removeChild(vm.$cameraVideo);
          } catch (e) {}

          resolve({
            status: 'stopOver'
          });
        });
      };

      Camera.prototype.cut = function () {
        var vm = this;
        return new Promise(function (resolve, reject) {
          if (!vm.$options.isOpen) {
            reject({
              status: 'cutError'
            });
          } else {
            var canvas = document.createElement('canvas');
            var width = vm.$cameraVideo.videoWidth;
            var height = vm.$cameraVideo.videoHeight;
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(vm.$cameraVideo, 0, 0, width, height);
            var base64 = canvas.toDataURL('image/png');
            resolve(base64);
          }
        });
      };

      Camera.prototype.getMedia = function () {
        return this.mediaStreamTrack;
      };
    }

    function Camera(options) {
      this._init(options);

      this._camera();
    }

    initMixin(Camera);
    initHTML(Camera);
    initCamera(Camera);

    return Camera;

})));
//# sourceMappingURL=index.js.map
