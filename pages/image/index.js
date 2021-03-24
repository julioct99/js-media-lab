const imgInput = document.querySelector('#imgUpload');
const imgPreviewContainer = document.querySelector('#img-preview-container');
const accordionButtons = document.querySelectorAll('.btn-accordion');
let imgPreview = document.querySelector('#imgPreview');

/* COMPRESSION */
const imgPreviewCompression = document.querySelector('#imgPreviewCompression');
const qualityInput = document.querySelector('#quality-input');
const originalSizeDisplay = document.querySelector('#originalSizeDisplay');
const compressedSizeDisplay = document.querySelector('#compressedSizeDisplay');
const compressionDisplay = document.querySelector('#compression-display');
const acceptedCompressionFormats = ['image/jpeg', 'image/webp'];

/* FILTERS */
const filtersForm = document.querySelector('#filters-form');
const resetFiltersBtn = document.querySelector('#reset-filters-btn');
const filterInputs = document.querySelectorAll('.filter-input');
const filterOutputs = document.querySelectorAll('.filter-output');
const brightnessInput = document.querySelector('#brightness-input');
const contrastInput = document.querySelector('#contrast-input');
const sepiaInput = document.querySelector('#sepia-input');
const saturationInput = document.querySelector('#saturation-input');

/* COLOR PALETTE */
const colorBox = document.querySelector('.color-box');
const mainColorDiv = document.querySelector('#mainColor');
const secondaryColorDivs = document.querySelectorAll('.color');
const colorThief = new ColorThief();
let colors = [];
let mainColor;

const image = {
  file: null,
  url: '',
};

imgInput.addEventListener('change', () => {
  image.file = imgInput.files[0];
  image.url = URL.createObjectURL(image.file);
  if (isImage(image.file)) {
    loadImage({ isReset: false });
    resetFilters();
    compressImage();
  } else {
    alert('The file must be an image');
  }
});

function loadImage(options) {
  setAccordionDisabled(false);
  imgPreviewContainer.innerHTML = `
    <img
      class="img-fluid"
      id="imgPreview"
      src="${image.url}"
    />
  `;
  imgPreview = document.querySelector('#imgPreview');
  imgPreview.addEventListener('load', () => {
    if (!options.isReset) extractPalette();
    setAccordionDisabled(false);
  });
}

function isImage(file) {
  const [type, _] = file.type.split('/');
  return type === 'image';
}

function setAccordionDisabled(disabled) {
  accordionButtons.forEach(
    (accordionButton) => (accordionButton.disabled = disabled)
  );
}

//
// ─── COLORTHIEF.JS ────────────────────────────────────────────────────────────────────
//

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

const getRGB = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

//
// ─── COMPRESSOR.JS ────────────────────────────────────────────────────────────────────
//

qualityInput.addEventListener('change', compressImage);

function compressImage() {
  new Compressor(image.file, {
    quality: +qualityInput.value,
    success(result) {
      displayCompressionResults(result);
    },
  });
}

function displayCompressionResults(result) {
  const originalSize = bytesToSize(image.file.size);
  const compressedSize = bytesToSize(result.size);
  const compressionRate = (
    ((image.file.size - result.size) / image.file.size) *
    100
  ).toFixed(2);

  originalSizeDisplay.textContent = originalSize;
  compressedSizeDisplay.textContent = compressedSize;
  compressionDisplay.textContent = compressionRate + '%';

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

//
// ─── CAMAN.JS ────────────────────────────────────────────────────────────────────
//

filterInputs.forEach((filterInput) =>
  filterInput.addEventListener('change', () => {
    loadImage({ isReset: true });
    applyFilters();
  })
);

resetFiltersBtn.addEventListener('click', resetFilters);

function resetFilters() {
  loadImage({ isReset: true });
  filterInputs.forEach((filterInput) => (filterInput.value = 0));
  filterOutputs.forEach((filterOutput) => (filterOutput.textContent = 0));
}

function applyFilters() {
  Caman('#imgPreview', function () {
    this.brightness(+brightnessInput.value);
    this.contrast(+contrastInput.value);
    this.sepia(+sepiaInput.value);
    this.saturation(+saturationInput.value);
    this.render();
  });
}
