import * as Tone from 'tone';
import SubBass from '../Instruments/Bass/SubBass';
import {getBassline} from '../Patterns/Bassline';

class BassController {
    constructor() {
        this.instrument = new SubBass();
        this.output = this.instrument.output;
        this.bassline = [];
        this.sequence = new Tone.Sequence();
        this.on = true;
    }

    update(rootsAndFifths) {
        this.bassline = getBassline(rootsAndFifths);
        this.updateSequence();
    }

    updateSequence() {
        this.sequence.dispose();
        this.sequence = new Tone.Sequence((time,note) => {
            if(note!==0 && this.on) {
                this.instrument.trigger(note, "2n", time);
            }
        },this.bassline,'16n').start(0);
        
        this.sequence.humanize = true;
    }
}

export default BassController;