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

const octave = '4';
const synth = new Tone.Synth().toDestination();

function playKey(key) {
  const tone = key.toUpperCase().replace('S', '#') + octave;
  synth.triggerAttackRelease(tone, '8n');
}

document.querySelectorAll('.key').forEach((key) => {
  key.addEventListener('click', (event) => playKey(event.target.id));
});

document.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    const key = event.key.toLowerCase();
    const keyCode = noteMap[key];
    const pianoKey = document.querySelector('.' + keyCode);
    pianoKey.classList.add('active');
    playKey(keyCode);
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  const keyCode = noteMap[key];
  const pianoKey = document.querySelector('.' + keyCode);
  pianoKey.classList.remove('active');
});
