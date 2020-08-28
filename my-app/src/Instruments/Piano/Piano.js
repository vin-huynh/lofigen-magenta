import * as Tone from 'tone';
import {samples} from './Samples'; 

class Piano {
    constructor(cb) {
        const cmp = new Tone.Compressor(-12,4);
        const postRvb = new Tone.Reverb({
            decay: 2.22,
            preDelay: 0.33,
            wet: 0.11
        });
        const lpf = new Tone.Filter({
            frequency: 2400,
            Q: 0.5,
            type: 'lowpass',
        });
        const eq = new Tone.EQ3({
            lowFrequency:200,
            highFrequency:700,
            low:0, 
            mid: -1, 
            high: 0
        });
        const vol = new Tone.Volume(-1);
        this.sampler = new Tone.Sampler(samples, () => cb());
        this.output = new Tone.Gain(1);
        this.sampler.chain(lpf, cmp, postRvb, eq, vol, this.output);
    }

    trigger(note, duration, time) {
        this.sampler.triggerAttackRelease(note, duration, Tone.Time(time) + Tone.Time('32n'));
    }
}

export default Piano;