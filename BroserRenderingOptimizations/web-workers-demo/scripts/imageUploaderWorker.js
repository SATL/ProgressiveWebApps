this.onFile = function (e) {
    var reader = new FileReader();

    var canvas = e.data.canvas;
    var ctx = e.data.ctx;
    var file = e.data.file;

    var worker = this;

    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            original = ctx.getImageData(0, 0, canvas.width, canvas.height);
            worker.postMessage(original);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}