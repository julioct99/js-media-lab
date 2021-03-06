const imgInput = document.querySelector('#imgUpload');
const imgPreview = document.querySelector('#imgPreview');
const imgPreviewCompression = document.querySelector('#imgPreviewCompression');

const extractColorsBtn = document.querySelector('#extractColorsBtn');

const originalSizeDisplay = document.querySelector('#originalSizeDisplay');
const compressedSizeDisplay = document.querySelector('#compressedSizeDisplay');
const totalCompressionDisplay = document.querySelector(
  '#totalCompressionDisplay'
);
const qualityRange = document.querySelector('#quality-range');

const colorBox = document.querySelector('.color-box');
const mainColorDiv = document.querySelector('#mainColor');
const secondaryColorDivs = document.querySelectorAll('.color');
const urlForm = document.querySelector('#urlForm');

let imgFile;

const colorThief = new ColorThief();
let colors = [];
let mainColor;

imgInput.addEventListener('change', () => {
  imgFile = imgInput.files[0];
  const url = URL.createObjectURL(imgFile);
  extractColorsBtn.disabled = false;
  colorBox.style.display = 'none';
  compressImage();
  loadImage(url);
});

extractColorsBtn.addEventListener('click', () => {
  mainColor = colorThief.getColor(imgPreview);
  colors = colorThief.getPalette(imgPreview, 6);
  colorBox.style.display = 'block';

  setColor(mainColorDiv, mainColor);
  secondaryColorDivs.forEach((colorDiv, index) => {
    setColor(colorDiv, colors[index]);
  });
  extractColorsBtn.disabled = true;
});

urlForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = document.querySelector('#urlInput').value;
  extractColorsBtn.disabled = true;
  colorBox.style.display = 'none';
  if (url) loadImage(url);
});

function loadImage(src) {
  imgPreview.src = src;
}

function setColor(element, color) {
  element.style.backgroundColor = getRGB(color);
  element.textContent = rgbToHex(...color);
}

function getRGB(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

/* COMPRESSOR.JS */

qualityRange.addEventListener('change', compressImage);

function compressImage() {
  new Compressor(imgFile, {
    quality: +qualityRange.value,
    success(result) {
      displayCompressionResults(result);
    },
  });
}

function displayCompressionResults(result) {
  const originalSize = bytesToSize(imgFile.size);
  const originalSizeInt = sizeToInt(originalSize);
  const compressedSize = bytesToSize(result.size);
  const compressedSizeInt = sizeToInt(compressedSize);
  const compression = (
    ((originalSizeInt - compressedSizeInt) / originalSizeInt) *
    100
  ).toFixed(2);

  originalSizeDisplay.textContent = originalSize;
  compressedSizeDisplay.textContent = compressedSize;
  totalCompressionDisplay.textContent = compression + '%';

  const url = URL.createObjectURL(result);
  imgPreviewCompression.src = url;
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const sizeToInt = (sizeString) => sizeString.split(' ')[0];
