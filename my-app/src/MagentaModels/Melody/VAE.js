import * as mm from '@magenta/music';

const modelURL = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_chords';
const model = new mm.MusicVAE(modelURL);

export default model;