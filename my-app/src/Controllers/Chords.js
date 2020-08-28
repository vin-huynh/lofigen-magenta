import * as Tone from 'tone';
import Guitar from '../Instruments/Guitar/Guitar';
import Piano from '../Instruments/Piano/Piano';
import {prob} from '../Util/Util';

class ChordController {
    constructor(setReady) {
        this.setReady = setReady;
        this.loadStatus = {
            guitar: false,
            piano: false
        }
        this.instrument = {};
        this.output = new Tone.Gain(1);
        this.chords = [];
        this.sequence = new Tone.Sequence();
        this.init();
        this.on = true;
    }

    init() {
        this.guitar = new Guitar(this.updateLoadStatus('guitar'));
        this.piano = new Piano(this.updateLoadStatus('piano'));
        const sw = new Tone.StereoWidener(0.67);
        const hsf = new Tone.Filter(200,'highshelf');
        this.guitar.output.chain(hsf,sw,this.output);
        this.piano.output.chain(hsf,sw,this.output);
    }

    updateLoadStatus(type) {
        this.loadStatus[type] = true;
        let loaded = true;
        for(const t in this.loadStatus) {
            loaded = this.loadStatus[t] && loaded;
        }
        this.setReady('chords', loaded);
    }

    update(chords) {
        this.chords = chords;
        this.instrument = prob(0.5) ? this.guitar : this.piano;
        this.updateSequence();
    }

    updateSequence() {
        this.sequence.dispose();
        this.sequence = new Tone.Sequence((time,value) => {
            if(this.on) {
                value.chord.forEach((note,i) => {
                    this.instrument.trigger(note, "1m", Tone.Time(time) + Tone.Time(0.015*i));
                });
            }
        },this.chords.map(chord => {return {chord: chord}}),'1m').start(0);
        
        this.sequence.humanize = true;
    }
}

export default ChordController;