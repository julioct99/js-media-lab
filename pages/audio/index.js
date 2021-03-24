const playPauseBtn = document.querySelector('#play-pause-btn');
const playbackRateBtn = document.querySelector('#playback-rate-btn');
const playbackRateDisplay = document.querySelector('#playback-rate-display');
const loopBtn = document.querySelector('#loop-btn');
const loopDisplay = document.querySelector('#loop-display');
const volumeInput = document.querySelector('#volume-input');
const fileInput = document.querySelector('#file-input');
const progressValue = document.querySelector('.progress-value');
const progressInput = document.querySelector('#progress-input');
const spinner = document.querySelector('.lds-ring');
const fileNameDisplay = document.querySelector('#file-name-display');
const currentTimeDisplay = document.querySelector('#current-time-display');
const totalTimeDisplay = document.querySelector('#total-time-display');

let progressInputIsActive = false;
let progressInterval = null;
const rates = [0.5, 0.7, 1.0, 1.5, 2.0];

const audioFile = {
  file: null,
  sound: null,
  url: '',
  loaded: false,
  loop: false,
  rate: 1.0,
  format: '',
};

fileInput.addEventListener('change', () => {
  setInterfaceReady(false);
  audioFile.file = fileInput.files[0];
  audioFile.url = URL.createObjectURL(audioFile.file);
  audioFile.format = [getFileType(audioFile.file)] || ['mp3', 'wav'];
  alert(typeof audioFile.format);
  initHowler();
});

function setInterfaceReady(ready) {
  spinner.style.display = ready ? 'none' : 'inline-block';
  playPauseBtn.disabled = ready ? false : true;
  progressInput.disabled = ready ? false : true;
  updatePlayButton();
}

function updatePlayButton() {
  if (!audioFile.sound) return;

  const className = 'material-icons icon-lg';
  const iconName = audioFile.sound.playing() ? 'pause' : 'play_arrow';
  progressValue.style.transition = 'all 0.25s linear';
  playPauseBtn.innerHTML = `<span class="${className}"> ${iconName} </span>`;
}

function initHowler(format) {
  audioFile.sound?.stop();
  audioFile.sound = new Howl({
    src: [audioFile.url],
    rate: audioFile.rate,
    format: audioFile.format,
  });
  audioFile.sound.on('load', handleSoundLoaded);
  audioFile.sound.on('end', handleSoundEnded);
  audioFile.sound.on('stop', handleSoundStopped);
  Howler.volume(volumeInput.value);
}

function handleSoundLoaded() {
  audioFile.loaded = true;
  fileNameDisplay.textContent = audioFile.file.name;
  totalTimeDisplay.textContent = toTimeString(audioFile.sound.duration());
  currentTimeDisplay.textContent = toTimeString(0);
  progressInterval = setInterval(() => updateAudioProgress(), 25);
  setInterfaceReady(true);
}

function handleSoundEnded() {
  updatePlayButton();
}

function handleSoundStopped() {
  progressValue.style.width = '0%';
  progressValue.style.transition = 'all 0.25s linear';
  clearInterval(progressInterval);
}

function updateAudioProgress() {
  if (progressInputIsActive || !audioFile.sound || !audioFile.sound.playing()) return;

  const currentTime = audioFile.sound.seek();
  const duration = audioFile.sound.duration();
  const width = (currentTime / duration) * 100;
  progressValue.style.width = width.toFixed(2) + '%';
  currentTimeDisplay.textContent = toTimeString(currentTime);
}

function setAudioProgress(percentProgress, options) {
  const duration = audioFile.sound.duration();
  const moveTo = duration * (percentProgress / 100);
  progressValue.style.transition = 'none';
  progressValue.style.width = percentProgress + '%';
  currentTimeDisplay.textContent = toTimeString(moveTo);
  if (options?.seek) audioFile.sound?.seek(moveTo);
}

document.addEventListener('keypress', (event) => {
  const key = event.key.toLowerCase();
  if (key === ' ') pressPlayPauseButton();
});

function pressPlayPauseButton() {
  if (!audioFile.loaded) return;

  audioFile.sound?.playing() ? audioFile.sound.pause() : audioFile.sound.play();
  updatePlayButton();
}

playbackRateBtn.addEventListener('click', () => {
  const currentRateIndex = rates.indexOf(audioFile.rate);
  const newRateIndex = (currentRateIndex + 1) % rates.length;
  const rate = rates[newRateIndex];
  audioFile.rate = rate;
  audioFile.sound?.rate(rate);
  playbackRateDisplay.textContent = hasDecimal(rate) ? rate : rate + '.0';
});

loopBtn.addEventListener('click', () => {
  audioFile.loop = !audioFile.loop;
  audioFile.sound?.loop(audioFile.loop);
  loopBtn.classList.toggle('active');
  loopDisplay.textContent = audioFile.loop ? 'On ' : 'Off';
});

progressInput.addEventListener('input', (event) => {
  const percentProgress = event.target.value * 100;
  progressInputIsActive = true;
  setAudioProgress(percentProgress);
});

progressInput.addEventListener('change', (event) => {
  const percentProgress = event.target.value * 100;
  progressInputIsActive = false;
  setAudioProgress(percentProgress, { seek: true });
});

playPauseBtn.addEventListener('click', pressPlayPauseButton);
volumeInput.addEventListener('input', (event) => Howler.volume(event.target.value));

const toTimeString = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 12);
const hasDecimal = (number) => number % 1 !== 0;
const getFileType = (file) => file.type?.split('/')[1] || null;
