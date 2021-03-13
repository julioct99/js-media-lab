const playPauseBtn = document.querySelector('#play-pause-btn');
const volumeInput = document.querySelector('#volume-input');
const fileInput = document.querySelector('#file-input');
const progressValue = document.querySelector('.progress-value');
const spinner = document.querySelector('.lds-ring');

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

  if (isAudio(audioFile.file)) {
    playPauseBtn.disabled = true;
    displayLoadingSpinner();

    // type -> 'audio/wav', 'audio/mp3' ...
    const format = audioFile.file.type.split('/')[1];

    audioFile.sound?.stop();
    audioFile.sound = new Howl({
      src: [audioFile.url],
      format: [format],
      volume: volumeInput.value,
    });

    audioFile.sound.once('load', () => {
      audioFile.loaded = true;
      playPauseBtn.disabled = false;
      progressValue.style.width = '0%';

      updatePlayButton();
      hideLoadingSpinner();
    });

    clearInterval(progressInterval);
    progressInterval = setInterval(() => updateAudioProgress(), 25);
  } else {
    alert('The file has to be an audio file');
  }
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

function isAudio(file) {
  const [type, extension] = file.type.split('/');
  return type === 'audio';
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
