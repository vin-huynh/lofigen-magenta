import * as mm from '@magenta/music';

const modelURL = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/drums_4bar_med_q2';
const model = new mm.MusicVAE(modelURL);

export default model;