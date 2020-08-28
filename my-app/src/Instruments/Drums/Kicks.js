import * as Tone from 'tone';
import {kicks} from './Samples';
import DrumSampleLoader from '../Util/DrumSampleLoader';
import {randEl} from '../../Util/Util';

const hpf = new Tone.Filter({
    frequency: 28,
    Q: 0.5,
    type: 'highpass',
});
const vol = new Tone.Volume(-16);

class Kicks {
    constructor(cb) {
        this.samples = DrumSampleLoader(kicks);
        this.players = new Tone.Players(this.samples, () => cb());
        this.selected = 0;
        this.output = new Tone.Gain(1);
        this.players.chain(hpf, vol, this.output);
    }

    trigger = (time) => {
        this.players.player(this.selected).state === 'started' ? 
        this.players.player(this.selected).restart(time) : 
        this.players.player(this.selected).start(time);
    }

    update() {
        this.selected = randEl(Object.keys(this.samples));
    }
}

export default Kicks;