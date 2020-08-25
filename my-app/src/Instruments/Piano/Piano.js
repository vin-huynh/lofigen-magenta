import * as Tone from 'tone';
import {samples} from './Samples'; 

const cmp = new Tone.Compressor(-12,4);
const eq = new Tone.EQ3({
    lowFrequency: 690,
    highFrequency: 2400,
    low: 0,
    mid: -4,
    high: 2,
});
const sat = new Tone.Chebyshev({
    order: 5,
    wet: 0.33,
});
const chr = new Tone.Chorus({
    frequency: 4,
    depth: 0.15,
    delayTime: 1.75,
    wet: 0.2
}).start();
const postRvb = new Tone.Reverb({
    decay: 3.33,
    preDelay: 0.33,
    wet: 0.11
});
const lpf = new Tone.Filter({
    frequency: 3200,
    Q: 0.5,
    type: 'lowpass',
});
const sw = new Tone.StereoWidener(0.5); 
const vol = new Tone.Volume(-1);

class Piano {
    constructor(cb) {
        this.types = ['acoustic','electric'];
        this.type = this.types[0];
        this.sampler = new Tone.Sampler(samples, () => cb());
        this.output = vol;
        this.switchTo(this.type);
    }

    getAcousticChain() {
        return [lpf, cmp, postRvb, sw, vol];
    }

    getElectricChain() {
        return [eq, lpf, sat, chr, cmp, postRvb, sw, vol];
    }

    switchTo(type) {
        this.type = type;
        let chain;
        switch(this.type) {
            case 'acoustic': {
                chain = this.getAcousticChain();
                break;
            }
            case 'electric': {
                chain = this.getElectricChain();
                break;
            }
            default: {
                break;
            }
        }
        this.disconnectAll();
        this.sampler.chain(...chain);
    }

    disconnectAll() {
        this.sampler.disconnect();
        lpf.disconnect();
        sw.disconnect();
        vol.disconnect();
        cmp.disconnect();
        eq.disconnect();
        sat.disconnect();
        chr.disconnect();
        postRvb.disconnect();
    }

    trigger(note, duration, time) {
        this.sampler.triggerAttackRelease(note, duration, Tone.Time(time) + Tone.Time('32n'));
    }
}

export default Piano;