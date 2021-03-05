const imgInput = document.querySelector('#imgUpload');
const imgPreview = document.querySelector('#imgPreview');
const extractColorsBtn = document.querySelector('#extractColorsBtn');
const colorBox = document.querySelector('.color-box');
const mainColorDiv = document.querySelector('#mainColor');
const secondaryColorDivs = document.querySelectorAll('.color');
const urlForm = document.querySelector('#urlForm');

const colorThief = new ColorThief();
let colors = [];
let mainColor;

imgInput.addEventListener('change', () => {
  const url = URL.createObjectURL(imgInput.files[0]);
  extractColorsBtn.disabled = false;
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
