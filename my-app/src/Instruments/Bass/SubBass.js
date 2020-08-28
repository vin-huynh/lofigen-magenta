import * as Tone from 'tone';

const hpf = new Tone.Filter({
    frequency: 28,
    Q: 0.5,
    type: 'highpass',
});

const lpf = new Tone.Filter({
    frequency: 120,
    Q: 0.5,
    type: 'lowpass',
});

const sat = new Tone.Chebyshev({
    order: 2,
    wet: 0.2
});

const vol = new Tone.Volume(-40);

class SubBass {
    constructor() {
        this.synth = new Tone.MonoSynth({
            oscillator: {
                type: 'sine',
            },
            envelope: {
                attack : 0.1,
                decay: 0.15,
                sustain: 0.75,
                release: 1.5
            }
        }).chain(hpf, lpf, sat, vol);
        this.output = vol;
    }

    trigger(note, duration, time) {
        this.synth.triggerAttackRelease(note, duration, Tone.Time(time) + Tone.Time('32n'));
    }
}

export default SubBass;