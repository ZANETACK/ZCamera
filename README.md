# ZCamera
浏览器相机

# 使用
```html
 <div id="camera"></div>
 <script>
   let camera = new ZCamera({
        el: '#camera',
        console: true,
        //相机的配置
        mediaOptions: {
            width: 1280,
            height: 720,
            video: true
        },
        init(options){
              console.log('options',options)
              if(options.status === 'opening'){
                   console.log('正在启动')
              }
              if(options.status === 'opened'){
                   console.log('启动完毕')
              }
        },
        stop(){
                   console.log('照相机已经关闭')
        }
   })
 </script>
```

