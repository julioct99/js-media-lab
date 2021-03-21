const playPauseBtn = document.querySelector('#play-pause-btn');
const playbackRateBtn = document.querySelector('#playback-rate-btn');
const playbackRateDisplay = document.querySelector('#playback-rate-display');
const loopBtn = document.querySelector('#loop-btn');
const volumeInput = document.querySelector('#volume-input');
const fileInput = document.querySelector('#file-input');
const progressValue = document.querySelector('.progress-value');
const progressInput = document.querySelector('#progress-input');
const spinner = document.querySelector('.lds-ring');

let progressInputIsActive = false;
let progressInterval = null;
const rates = [0.5, 1.0, 1.5, 2.0];

const audioFile = {
  file: null,
  sound: null,
  url: '',
  loaded: false,
  loop: false,
  rate: rates[1],
};

fileInput.addEventListener('change', () => {
  audioFile.file = fileInput.files[0];
  audioFile.url = URL.createObjectURL(audioFile.file);

  playPauseBtn.disabled = true;
  progressValue.style.width = '0%';
  progressInput.disabled = true;
  spinner.style.display = 'inline-block';

  // type -> 'audio/wav', 'audio/mp3' ...
  let format = [audioFile.file.type.split('/')[1]];
  if (!audioFile.file.type) format = ['mp3', 'wav'];

  audioFile.sound?.stop();
  audioFile.sound = new Howl({
    src: [audioFile.url],
    rate: audioFile.rate,
    format,
  });
  Howler.volume(volumeInput.value);

  audioFile.sound.on('load', handleSoundLoaded);
  audioFile.sound.on('end', updatePlayButton);
  audioFile.sound.on('stop', () => {
    progressValue.style.transition = 'all 0.25s linear';
  });

  clearInterval(progressInterval);
  progressInterval = setInterval(() => updateAudioProgress(), 25);
});

document.addEventListener('keypress', (event) => {
  const key = event.key.toLowerCase();
  if (key === ' ') pressPlayPauseButton();
});

playbackRateBtn.addEventListener('click', () => {
  const currentRateIndex = rates.indexOf(audioFile.rate);
  const newRateIndex = (currentRateIndex + 1) % rates.length;
  const rate = rates[newRateIndex];
  audioFile.rate = rate;
  audioFile.sound?.rate(rate);
  playbackRateDisplay.textContent = rate % 1 !== 0 ? rate : rate + '.0';
});

playPauseBtn.addEventListener('click', pressPlayPauseButton);

loopBtn.addEventListener('click', () => {
  audioFile.loop = !audioFile.loop;
  audioFile.sound.loop(audioFile.loop);
  loopBtn.classList.toggle('active');
});

volumeInput.addEventListener('input', (event) => {
  const volume = event.target.value;
  Howler.volume(volume);
});

progressInput.addEventListener('input', (event) => {
  if (!audioFile.sound) return;
  progressInputIsActive = true;
  const percentProgress = event.target.value * 100;
  setAudioProgress(percentProgress);
});

progressInput.addEventListener('change', (event) => {
  progressInputIsActive = false;

  const percentProgress = event.target.value * 100;
  setAudioProgress(percentProgress);
  const duration = audioFile.sound.duration();
  const moveTo = duration * (percentProgress / 100);
  audioFile.sound.seek(moveTo);
});

function pressPlayPauseButton() {
  if (!audioFile.loaded) return;

  if (audioFile.sound?.playing()) {
    audioFile.sound.pause();
  } else {
    audioFile.sound.play();
  }
  updatePlayButton();
}

function updatePlayButton() {
  progressValue.style.transition = 'all 0.25s linear';
  const className = 'material-icons icon-lg';

  if (audioFile.sound && audioFile.sound.playing()) {
    playPauseBtn.innerHTML = `<span class="${className}"> pause </span>`;
  } else {
    playPauseBtn.innerHTML = `<span class="${className}"> play_arrow </span>`;
  }
}

function updateAudioProgress() {
  if (!progressInputIsActive && audioFile.sound && audioFile.sound.playing()) {
    const currentTime = audioFile.sound.seek();
    const duration = audioFile.sound.duration();
    const width = (currentTime / duration) * 100;
    progressValue.style.width = width.toFixed(2) + '%';
  }
}

function setAudioProgress(percentProgress) {
  progressValue.style.transition = 'none';
  progressValue.style.width = percentProgress + '%';
}

function handleSoundLoaded() {
  audioFile.loaded = true;
  playPauseBtn.disabled = false;
  progressInput.disabled = false;
  spinner.style.display = 'none';
  updatePlayButton();
}
