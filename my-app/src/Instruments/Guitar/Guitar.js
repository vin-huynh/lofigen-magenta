import * as Tone from 'tone';
import {samples} from './Samples'; 

class Guitar {
    constructor(cb) {
        const preRvb = new Tone.Reverb({
            decay: 1.5,
            wet: 0.6
        });
        const sat = new Tone.Chebyshev({
            order: 9,
            wet: 0.2
        });
        const cmp = new Tone.Compressor(-12,4);
        const lpf = new Tone.Filter({
            frequency: 1200,
            Q: 0.5,
            type: 'lowpass',
        });
        const vol = new Tone.Volume(-1);
        const postRvb = new Tone.Reverb({
            decay: 6,
            preDelay: 0.2,
            wet: 0.15,
        });
        const eq = new Tone.EQ3({
                lowFrequency: 690,
                highFrequency: 2400,
                low:  0,
                mid:  -6,
                high: 6,
        });
        this.sampler = new Tone.Sampler(samples, () => cb());
        this.output = new Tone.Gain(1);
        this.sampler.chain(eq, preRvb, sat, lpf, cmp, postRvb, vol, this.output);
    }

    trigger(note, duration, time) {
        this.sampler.triggerAttackRelease(note, duration, time);
    }
}

export default Guitar;