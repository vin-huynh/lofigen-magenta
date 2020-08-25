import * as Tone from 'tone';
import {samples} from './Samples'; 

const preRvb = new Tone.Reverb({
    decay: 1.5,
    wet: 0.6
});
const sat = new Tone.Chebyshev({
    order: 9,
    wet: 0.2
});
const cmp = new Tone.Compressor(-12,4);
const chr = new Tone.Chorus({
    frequency: 4,
    depth: 0.2,
    delayTime: 2.5,
    wet: 0.33
}).start();

const lpf = new Tone.Filter({
    frequency: 2400,
    Q: 0.5,
    type: 'lowpass',
});
const wah = new Tone.AutoWah(50, 6, -30);
const sw  = new Tone.StereoWidener(0.67);
const vol = new Tone.Volume(-1);
const postRvb = new Tone.Reverb({
    decay: 6,
    preDelay: 0.2,
    wet: 0.15,
});
const eqs = {
    acoustic: new Tone.EQ3({
        lowFrequency: 690,
        highFrequency: 2400,
        low:  3,
        mid:  0,
        high: -3,
    }),
    clean: new Tone.EQ3({
        lowFrequency: 690,
        highFrequency: 2400,
        low:  0,
        mid:  -6,
        high: 6,
    }),
    washy: new Tone.EQ3({
        lowFrequency: 690,
        highFrequency: 2400,
        low:  0,
        mid:  -3,
        high: 3,
    }),
}

class Guitar {
    constructor(cb) {
        this.types = ['acoustic','clean','washy','wah'];
        this.type = this.types[1];
        this.sampler = new Tone.Sampler(samples, () => cb());
        this.output = vol;
        this.switchTo(this.type);
    }

    switchTo(type) {
        this.type = type;
        let chain;
        switch(this.type) {
            case 'acoustic': {
                chain = this.getAcousticChain();
                break;
            }
            case 'clean': {
                chain = this.getCleanChain();
                break;
            }
            case 'washy': {
                chain = this.getWashyChain();
                break;
            }
            case 'wah': {
                chain = this.getWahChain();
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
        eqs.acoustic.disconnect();
        eqs.clean.disconnect();
        eqs.washy.disconnect();
        lpf.disconnect();
        postRvb.disconnect();
        wah.disconnect();
        sw.disconnect();
        vol.disconnect();
        preRvb.disconnect();
        sat.disconnect();
        cmp.disconnect();
        chr.disconnect();
    }

    getAcousticChain() {
        return [eqs.acoustic, lpf, cmp, postRvb, sw, vol];
    }

    getCleanChain() {
        return [eqs.clean, preRvb, sat, lpf, cmp, postRvb, sw, vol];
    }

    getWashyChain() {
        return [eqs.washy, preRvb, sat, chr, lpf, cmp, postRvb, sw, vol];
    }

    getWahChain() {
        return [eqs.washy, preRvb, sat, chr, wah, lpf, cmp, postRvb, sw, vol];
    }

    trigger(note, duration, time) {
        this.sampler.triggerAttackRelease(note, duration, time);
    }
}

export default Guitar;