import * as Tone from 'tone';
import {percs} from './Samples';
import DrumSampleLoader from '../Util/DrumSampleLoader';
import {randEl} from '../../Util/Util';

const rvb = new Tone.Reverb({
    decay: 1,
    wet: 0.2
});
const cmp = new Tone.Compressor(-12,4);
const vol = new Tone.Volume(-24);

class Percs {
    constructor(cb) {
        this.samples = DrumSampleLoader(percs);
        this.players = new Tone.Players(this.samples, () => cb());
        this.output = new Tone.Gain(1);
        this.players.chain(cmp, rvb, vol, this.output);
    }

    trigger = (time) => {
        const selected = randEl(Object.keys(this.samples));
        if(this.players.player(selected).state === 'stopped') {
            this.players.player(selected).restart(time);
        }
    }

    update() {}
}

export default Percs;