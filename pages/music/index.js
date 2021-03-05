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

const pressedKeys = [];

function addPressedKey(keyCode) {
  const tone = keyCode.toUpperCase().replace('S', '#') + octave;
  pressedKeys.push(tone);
}

function removedPressedKey(keyCode) {
  const index = pressedKeys.indexOf(keyCode);
  pressedKeys.splice(index, 1);
}

let isPolyphonic = false;
let octave = 4;
let synth = new Tone.Synth().toDestination();

function playKey(keyCode) {
  console.log(pressedKeys);
  if (isPolyphonic) {
    synth.triggerAttackRelease(pressedKeys, '6n');
  } else {
    const tone = keyCode.toUpperCase().replace('S', '#') + octave;
    synth.triggerAttackRelease(tone, '6n');
  }
}

document.querySelector('#synthSelect').addEventListener('change', (event) => {
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

document.querySelectorAll('.key').forEach((key) => {
  key.addEventListener('click', (event) => playKey(event.target.id));
});

document.querySelector('#isPolyphonic').addEventListener('change', (event) => {
  isPolyphonic = event.target.checked;
  if (isPolyphonic) {
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
  }
});

document
  .querySelector('#octaveDownBtn')
  .addEventListener('click', () => changeOctave('down'));

document
  .querySelector('#octaveUpBtn')
  .addEventListener('click', () => changeOctave('up'));

document.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    const key = event.key.toLowerCase();
    const keyCode = noteMap[key];
    if (keyCode) {
      const pianoKey = document.querySelector('.' + keyCode);
      pianoKey.classList.add('active');
      addPressedKey(keyCode);
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
    const pianoKey = document.querySelector('.' + keyCode);
    pianoKey.classList.remove('active');
    removedPressedKey(keyCode);
  }
});

function changeOctave(direction) {
  if (direction === 'up' && octave < 10) {
    octave++;
  } else if (direction === 'down' && octave > 1) {
    octave--;
  }
  document.querySelector('#octaveSpan').textContent = `Octave (${octave})`;
}
