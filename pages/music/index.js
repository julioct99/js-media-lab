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
function removedPressedKey(keyCode) {
  const index = pressedKeys.indexOf(keyCode);
  pressedKeys.splice(index, 1);
}

let octave = 4;
let synth = new Tone.Synth().toDestination();

function playKey(key) {
  const tone = key.toUpperCase().replace('S', '#') + octave;
  synth.triggerAttackRelease(tone, '8n');
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

document.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    const key = event.key.toLowerCase();
    const keyCode = noteMap[key];
    if (keyCode) {
      const pianoKey = document.querySelector('.' + keyCode);
      pianoKey.classList.add('active');
      pressedKeys.push(keyCode);
      playKey(keyCode);
    } else {
      if (key === 'q') {
        changeOctave('up');
      } else if (key === 'a') {
        changeOctave('down');
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
