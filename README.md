# ZCamera
浏览器相机

# 使用
```html
 <div id="camera"></div>
<script>
    let camera = new ZCamera({
        el: '#camera',
        console: false
    });
    
    //启动
    let start = document.getElementById('start');
    start.onclick = function () {
        console.log('正在启动摄像机')
        camera.open().then(data => {
            console.log('status',data)
            if(data.status === "opened"){
                console.log('摄像机启动成功')
            }else{
                console.log('摄像机启动失败')
            }
        })
    }
    
    //停止
    let stop = document.getElementById('stop');
    stop.onclick = function () {
        camera.stop();
    }
    
    //截图
    let img = document.getElementById('img');
    let cut = document.getElementById('cut');
    cut.onclick = function () {
        camera.cut().then(base64 => {
            img.src = base64
        })
    }
</script>
```

