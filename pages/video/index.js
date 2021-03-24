const videoContainer = document.querySelector('#video-container');
const videoInput = document.querySelector('#video-upload');
const fileNameDisplay = document.querySelector('#file-name-display');

const supportedFormats = ['mp4', 'mov', 'ogv', 'webm'];
const video = {
  file: null,
  url: '',
};

videoInput.addEventListener('change', () => {
  video.file = videoInput.files[0];
  video.url = URL.createObjectURL(video.file);
  if (formatIsValid(video)) {
    console.log(video);
    loadVideo();
  } else {
    alert(
      'File format not supported. Supported formats are ' + supportedFormats
    );
  }
});

function loadVideo() {
  videoContainer.innerHTML = `
    <video
        id="my-video"
        class="video-js"
        controls
        preload="auto"
        data-setup="{}"
      >
        <source src="${video.url}" type="${video.file.type}" />
    </video>
  `;
  fileNameDisplay.textContent = video.file.name;
}

function formatIsValid(file) {
  const [type, extension] = file.file.type.split('/');
  return type === 'video' && supportedFormats.includes(extension);
}
