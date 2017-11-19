(function () {
  // http://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
  var original;
  var imageLoader = document.querySelector('#imageLoader');
  imageLoader.addEventListener('change', handleImage, false);
  var canvas = document.querySelector('#image');
  var ctx = canvas.getContext('2d');

  var imageWorker = new Worker('scripts/worker.js');
  var imageUploadWorker = new Worker('scripts/imageUploadWorker.js');


  imageUploadWorker.onmessage = function (e) {
    var image = e.data;
    if (data)
      original = image;
    else
      console.error('no original returned');
  }

  function handleImage(e) {


    imageUploadWorker.postMessage({
      canvas: canvas,
      file: e.target.files[0],
      ctx: ctx
    })

    /*var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        original = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);*/
  }

  // greys out the buttons while manipulation is happening
  // un-greys out the buttons when the manipulation is done
  function toggleButtonsAbledness() {
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].hasAttribute('disabled')) {
        buttons[i].removeAttribute('disabled')
      } else {
        buttons[i].setAttribute('disabled', null);
      }
    };
  }

  function manipulateImage(type) {
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    toggleButtonsAbledness();

    // Hint! This is where you should post messages to the web worker and
    // receive messages from the web worker.
    imageWorker.postMessage({
      type: type,
      imageData: imageData
    });

    /*length = imageData.data.length / 4;
    for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      r = imageData.data[i * 4 + 0];
      g = imageData.data[i * 4 + 1];
      b = imageData.data[i * 4 + 2];
      a = imageData.data[i * 4 + 3];
      pixel = manipulate(type, r, g, b, a);
      imageData.data[i * 4 + 0] = pixel[0];
      imageData.data[i * 4 + 1] = pixel[1];
      imageData.data[i * 4 + 2] = pixel[2];
      imageData.data[i * 4 + 3] = pixel[3];
    }*/
    imageWorker.onmessage = function (e) {
      toggleButtonsAbledness();
      image = e.data;
      if (image)
        return ctx.putImageData(image, 0, 0);
      else
        console.error('No image manipulated')
    }

    imageWorker.onerror = function (error) {
      function WorkerException(message) {
        this.name = "WorkerException";
        this.message = message;
      };
      throw new WorkerException('Worker error.');
    };
    /*toggleButtonsAbledness();
    return ctx.putImageData(imageData, 0, 0);*/
  };

  function revertImage() {
    return ctx.putImageData(original, 0, 0);
  }

  document.querySelector('#invert').onclick = function () {
    manipulateImage("invert");
  };
  document.querySelector('#chroma').onclick = function () {
    manipulateImage("chroma");
  };
  document.querySelector('#greyscale').onclick = function () {
    manipulateImage("greyscale");
  };
  document.querySelector('#vibrant').onclick = function () {
    manipulateImage("vibrant");
  };
  document.querySelector('#revert').onclick = function () {
    revertImage();
  };
})();