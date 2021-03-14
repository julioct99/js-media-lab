const playPauseBtn = document.querySelector('#play-pause-btn');
const volumeInput = document.querySelector('#volume-input');
const fileInput = document.querySelector('#file-input');
const progressValue = document.querySelector('.progress-value');
const progressInput = document.querySelector('#progress-input');
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
  });

  Howler.volume(volume);

  audioFile.sound.on('load', () => {
    audioFile.loaded = true;
    playPauseBtn.disabled = false;
    progressInput.style.cursor = 'pointer';

    updatePlayButton();
    hideLoadingSpinner();
  });

  audioFile.sound.on('end', updatePlayButton);

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

progressInput.addEventListener('input', (event) => {
  if (!audioFile.sound) return;

  if (!audioFile.sound.playing()) {
    const percentProgress = event.target.value * 100;
    progressValue.style.transition = 'none';
    progressValue.style.width = percentProgress + '%';

    const duration = audioFile.sound.duration();
    const moveTo = duration * (percentProgress / 100);

    audioFile.sound.seek(moveTo);
  }
});

function pressPlayPauseButton() {
  if (!audioFile.loaded) return;

  if (audioFile.sound?.playing()) {
    handleAudioStop();
  } else {
    handleAudioPlay();
  }
  updatePlayButton();
}

function handleAudioStop() {
  audioFile.sound?.pause();
  progressValue.style.background = '#4cbb17';
  progressInput.style.cursor = 'pointer';
}

function handleAudioPlay() {
  audioFile.sound?.play();
  progressValue.style.transition = 'all 0.25s linear';
  progressValue.style.background = '#007bff';
  progressInput.style.cursor = 'not-allowed';
}

function updatePlayButton() {
  console.log(audioFile.sound.playing());
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

    progressValue.style.width = width.toFixed(2) + '%';
  }
}

function displayLoadingSpinner() {
  spinner.style.display = 'inline-block';
}

function hideLoadingSpinner() {
  spinner.style.display = 'none';
}
