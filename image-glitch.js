/* Copyright (C) 2015 Jonathan Müller - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 *
 * You should have received a copy of the MIT license with
 * this file. If not, visit: https://github.com/jo-m/image-glitch
 *
 * Code originally based on http://codepen.io/lbebber/pen/EjVPao
 */

 var ImageGlitch = function(img){
  // probability for glitch
  this.pGlitch = 0.2;
  // glitch period
  this.intervalMs = 1000;
  // after a glitch, wait for this time until original image is shown again
  this.restoreMs = 25;

  // data segment at begin to spare from corruption
  this.headerSize = 2200;
  this.img = img;
  this.data = null;
}

ImageGlitch.prototype.start = function() {
  this.data = this.getBase64Image(this.img);
  this.img.setAttribute('src', this.data)

  setInterval(this.glichImage.bind(this), this.intervalMs);
}

ImageGlitch.prototype.getBase64Image = function(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
}

ImageGlitch.prototype.flipBytes = function(data, index) {
  return data.substr(0, index) +
    data.charAt(index + 1) +
    data.charAt(index) +
    data.substr(index + 2);
}

ImageGlitch.prototype.corruptData = function(data) {
  var corrupted = data;
  var nErrors = Math.random() * 100;
  for (var i = 0; i < nErrors; i++) {
    var index = this.headerSize +
      Math.round(Math.random() * (corrupted.length - this.headerSize - 1));
    corrupted = this.flipBytes(corrupted, index);
  }
  return corrupted;
}

ImageGlitch.prototype.glichImage = function() {
  if (Math.random() < this.pGlitch) {
    this.img.setAttribute('src', this.corruptData(this.data))
    setTimeout(this.restoreOriginalImage.bind(this), this.restoreMs)
  }
}

ImageGlitch.prototype.restoreOriginalImage = function() {
  this.img.setAttribute('src', this.data);
}
