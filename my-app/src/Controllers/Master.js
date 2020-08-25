import * as Tone from 'tone';
import ProgressionGenerator from '../Progressions/ProgressionGenerator';
import BassController from './Basses';
import ChordController from './Chords';
import DrumController from './Drums';
import MelodyController from './Melody';
import {prob, randEl} from '../Util/Util';

Tone.Context.lookAhead = 0.1;
Tone.Transport.bpm.value = 80;

class Master {
    constructor(setReady) {
        this.output = new Tone.Gain(1);
        this.output.toDestination();
        this.pg = new ProgressionGenerator();
        this.bc = new BassController();
        this.cc = new ChordController(setReady);
        this.dc = new DrumController(setReady);
        this.mc = new MelodyController(setReady);

        this.loop = new Tone.Loop((time) => {
            this.bc.on = prob(0.95);
            this.cc.on = true;
            this.dc.on = prob(0.95);
            this.mc.on = prob(0.95);
            this.mc.voice = randEl([0,1,2]);
            this.mc.updateInstrument();
        },'8m').start(0);
    }

    connectControllerOutputs() {
        this.bc.output.connect(this.output);
        this.cc.output.connect(this.output);
        this.dc.output.connect(this.output);
        this.mc.output.connect(this.output);
    }

    generateSong() {
        this.pg.generateProgression();
        this.bc.update(this.pg.getRootsAndFifths(1));
        this.cc.update(this.pg.getShellVoicings(3,true));
        this.dc.update();
        this.mc.update(this.pg.getChordScales(),this.pg.chords,this.pg.form);
    }

    play() {
        Tone.start();
        Tone.Transport.start();
    }

    stop() {
        Tone.Transport.stop();
    }


}

export default Master;