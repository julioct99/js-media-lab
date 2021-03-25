const synthSelect = document.querySelector('#synth-select');
const pianoKeys = document.querySelectorAll('.key');
const octaveDownBtn = document.querySelector('#octave-down-btn');
const octaveUpBtn = document.querySelector('#octave-up-btn');
const octaveDisplay = document.querySelector('#octave-span');

const noteMap = {
  z: 'c',
  s: 'cs',
  x: 'd',
  d: 'ds',
  c: 'e',
  v: 'f',
  g: 'fs',
  b: 'g',
  h: 'gs',
  n: 'a',
  j: 'as',
  m: 'b',
};

let octave = 4;
let synth = new Tone.Synth().toDestination();

function playKey(keyCode) {
  const tone = keyCode.toUpperCase().replace('S', '#') + octave;
  synth.triggerAttackRelease(tone, '6n');
}

synthSelect.addEventListener('change', (event) => {
  switch (event.target.value) {
    case 'std':
      synth = new Tone.Synth().toDestination();
      break;
    case 'am':
      synth = new Tone.FMSynth().toDestination();
      break;
    case 'fm':
      synth = new Tone.AMSynth().toDestination();
      break;
    case 'duo':
      synth = new Tone.DuoSynth().toDestination();
      break;
    case 'membrane':
      synth = new Tone.MembraneSynth().toDestination();
      break;
    case 'metal':
      synth = new Tone.MetalSynth().toDestination();
      break;
  }
});

pianoKeys.forEach((key) => {
  key.addEventListener('click', (event) => playKey(event.target.id));
});

octaveDownBtn.addEventListener('click', octaveDown);

octaveUpBtn.addEventListener('click', octaveUp);

document.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  const key = event.key.toLowerCase();
  const keyCode = noteMap[key];
  if (key === 'q') octaveDown();
  if (key === 'w') octaveUp();
  if (!keyCode) return;

  const pianoKey = getElementByClassName(keyCode);
  pianoKey.classList.add('active');
  playKey(keyCode);
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  const keyCode = noteMap[key];

  if (!keyCode) return;

  const pianoKey = getElementByClassName(keyCode);
  pianoKey.classList.remove('active');
});

function octaveUp() {
  if (octave < 10) octave++;
  setOctaveDisplay(octave);
}

function octaveDown() {
  if (octave > 1) octave--;
  setOctaveDisplay(octave);
}

const setOctaveDisplay = (octave) => (octaveDisplay.textContent = `Octave (${octave})`);
const getElementByClassName = (classname) => document.querySelector('.' + classname);
