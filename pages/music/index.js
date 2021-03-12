const synthSelect = document.querySelector('#synthSelect');
const pianoKeys = document.querySelectorAll('.key');
const octaveDownBtn = document.querySelector('#octaveDownBtn');
const octaveUpBtn = document.querySelector('#octaveUpBtn');
const octaveDisplay = document.querySelector('#octaveSpan');

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

octaveDownBtn.addEventListener('click', () => changeOctave('down'));

octaveUpBtn.addEventListener('click', () => changeOctave('up'));

document.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    const key = event.key.toLowerCase();
    const keyCode = noteMap[key];
    if (keyCode) {
      const pianoKey = getElementByClassName(keyCode);
      pianoKey.classList.add('active');
      playKey(keyCode);
    } else {
      if (key === 'q') {
        changeOctave('down');
      } else if (key === 'w') {
        changeOctave('up');
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  const keyCode = noteMap[key];
  if (keyCode) {
    const pianoKey = getElementByClassName(keyCode);
    pianoKey.classList.remove('active');
  }
});

function changeOctave(direction) {
  if (direction === 'up' && octave < 10) {
    octave++;
  } else if (direction === 'down' && octave > 1) {
    octave--;
  }
  octaveDisplay.textContent = `Octave (${octave})`;
}

const getElementByClassName = (classname) =>
  document.querySelector('.' + classname);
