const imgInput = document.querySelector('#imgUpload');
const imgPreviewContainer = document.querySelector('#img-preview-container');
const accordionButtons = document.querySelectorAll('.btn-accordion');
let imgPreview = document.querySelector('#imgPreview');

/* COMPRESSION HTML ELEMENTS */
const imgPreviewCompression = document.querySelector('#imgPreviewCompression');
const qualityRange = document.querySelector('#quality-range');
const originalSizeDisplay = document.querySelector('#originalSizeDisplay');
const compressedSizeDisplay = document.querySelector('#compressedSizeDisplay');
const compressionDisplay = document.querySelector('#compression-display');
const acceptedCompressionFormats = ['image/jpeg', 'image/webp'];

/* FILTERS HTML ELEMENTS */
const filtersForm = document.querySelector('#filters-form');
const resetFiltersBtn = document.querySelector('#reset-filters-btn');
const filterRangeInputs = document.querySelectorAll('.filters-range');
const filterRangeOutputs = document.querySelectorAll('.filter-range-output');
const brightnessRange = document.querySelector('#brightness-range');
const contrastRange = document.querySelector('#contrast-range');
const sepiaRange = document.querySelector('#sepia-range');
const saturationRange = document.querySelector('#saturation-range');
let hasAppliedFilters = false;

/* COLOR PALETTE HTML ELEMENTS */
const colorBox = document.querySelector('.color-box');
const mainColorDiv = document.querySelector('#mainColor');
const secondaryColorDivs = document.querySelectorAll('.color');
const colorThief = new ColorThief();
let colors = [];
let mainColor;

let imgFile;
let imgURL;

imgInput.addEventListener('change', () => {
  imgFile = imgInput.files[0];
  imgURL = URL.createObjectURL(imgFile);
  loadImage(false);
  resetFilters();
  compressImage();
});

function loadImage(isReset) {
  setAccordionDisabled(true);
  imgPreviewContainer.innerHTML = `
    <img
      class="img-fluid"
      id="imgPreview"
      src="${imgURL}"
    />
  `;
  imgPreview = document.querySelector('#imgPreview');
  imgPreview.addEventListener('load', () => {
    if (!isReset) extractPalette();
    setAccordionDisabled(false);
  });
}

function setAccordionDisabled(disabled) {
  accordionButtons.forEach(
    (accordionButton) => (accordionButton.disabled = disabled)
  );
}

/* COLORTHIEF.JS */

function extractPalette() {
  mainColor = colorThief.getColor(imgPreview);
  colors = colorThief.getPalette(imgPreview, 6);

  setColor(mainColorDiv, mainColor);
  secondaryColorDivs.forEach((colorDiv, index) => {
    setColor(colorDiv, colors[index]);
  });
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
  const compressedSize = bytesToSize(result.size);
  const compression = (
    ((imgFile.size - result.size) / imgFile.size) *
    100
  ).toFixed(2);

  originalSizeDisplay.textContent = originalSize;
  compressedSizeDisplay.textContent = compressedSize;
  compressionDisplay.textContent = compression + '%';

  const url = URL.createObjectURL(result);
  imgPreviewCompression.src = url;
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const sizeToInt = (sizeString) => sizeString.split(' ')[0];

/* CAMAN.JS */

filterRangeInputs.forEach((filterRangeInput) =>
  filterRangeInput.addEventListener('change', () => {
    loadImage(true);
    applyFilters();
  })
);

resetFiltersBtn.addEventListener('click', resetFilters);

function resetFilters() {
  loadImage(true);
  filterRangeInputs.forEach((filterRangeInput) => (filterRangeInput.value = 0));
  filterRangeOutputs.forEach(
    (filterRangeOutput) => (filterRangeOutput.textContent = 0)
  );
}

function applyFilters() {
  Caman('#imgPreview', function () {
    hasAppliedFilters = true;
    this.brightness(+brightnessRange.value);
    this.contrast(+contrastRange.value);
    this.sepia(+sepiaRange.value);
    this.saturation(+saturationRange.value);
    this.render();
  });
}
