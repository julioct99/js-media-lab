const playPauseBtn = document.querySelector('#play-pause-btn');
const volumeInput = document.querySelector('#volume-input');
const fileInput = document.querySelector('#file-input');
const progressValue = document.querySelector('.progress-value');
const spinner = document.querySelector('.lds-ring');

window.URL = window.URL || window.webkitURL;

const audioFile = {
  file: null,
  sound: null,
  url: '',
  loaded: false,
};

let progressInterval = null;

fileInput.addEventListener('change', () => {
  audioFile.file = fileInput.files[0];
  audioFile.url = URL.createObjectURL(audioFile.file);

  playPauseBtn.disabled = true;
  progressValue.style.width = '0%';
  displayLoadingSpinner();

  // type -> 'audio/wav', 'audio/mp3' ...
  let format = [audioFile.file.type.split('/')[1]];
  if (!audioFile.file.type) format = ['mp3', 'wav'];

  audioFile.sound?.stop();
  audioFile.sound = new Howl({
    src: [audioFile.url],
    format,
    volume: volumeInput.value,
  });

  audioFile.sound.once('load', () => {
    audioFile.loaded = true;
    playPauseBtn.disabled = false;

    updatePlayButton();
    hideLoadingSpinner();
  });

  clearInterval(progressInterval);
  progressInterval = setInterval(() => updateAudioProgress(), 25);
});

document.addEventListener('keypress', (event) => {
  const key = event.key.toLowerCase();
  if (key === ' ') pressPlayPauseButton();
});

playPauseBtn.addEventListener('click', pressPlayPauseButton);

volumeInput.addEventListener('input', (event) => {
  const volume = event.target.value;
  Howler.volume(volume);
});

function pressPlayPauseButton() {
  if (!audioFile.loaded) return;

  if (audioFile.sound?.playing()) {
    audioFile.sound?.pause();
  } else {
    audioFile.sound?.play();
  }
  updatePlayButton();
}

function updatePlayButton() {
  if (audioFile.sound && audioFile.sound.playing()) {
    playPauseBtn.innerHTML = `<span class="material-icons"> pause </span>`;
  } else {
    playPauseBtn.innerHTML = `<span class="material-icons"> play_arrow </span>`;
  }
}

function updateAudioProgress() {
  if (audioFile.sound && audioFile.sound.playing()) {
    const currentTime = audioFile.sound.seek();
    const duration = audioFile.sound.duration();
    const width = (currentTime / duration) * 100;

    if (Math.round(width) === 100) {
      updatePlayButton();
    } else {
      progressValue.style.width = width + '%';
    }
  }
}

function displayLoadingSpinner() {
  spinner.style.display = 'inline-block';
}

function hideLoadingSpinner() {
  spinner.style.display = 'none';
}
