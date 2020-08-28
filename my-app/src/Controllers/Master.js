import * as Tone from 'tone';
import ProgressionGenerator from '../Progressions/ProgressionGenerator';
import BassController from './Basses';
import ChordController from './Chords';
import DrumController from './Drums';
import MelodyController from './Melody';
import Vinyl from '../Instruments/Vinyl/Vinyl';
import {prob, randEl} from '../Util/Util';

Tone.Context.lookAhead = 0.5;
Tone.Transport.bpm.value = 80;
const hpf = new Tone.Filter(28,'highpass');
const lpf = new Tone.Filter(6400,'lowpass');

const eq = new Tone.EQ3({
    lowFrequency: 400,
    highFrequency: 1600,
    low: -1,
    mid: 1,
    high: -1,
});

class Master {
    constructor(setInstrumentsReady, setPartsReady) {
        this.pg = new ProgressionGenerator();
        this.setInstrumentsReady = setInstrumentsReady;
        this.setPartsReady = setPartsReady;
        this.instrumentsLoaded = false;
        this.partsLoaded = false;
        this.instrumentLoadStatus = {
            chords: false,
            melody: false,
            drums: false,
            vinyl: false,
        };
        this.partLoadStatus = {
            drums: false,
            melody: false,
        }
        this.updateInstrumentLoadStatus = (controller, ready) => {
            this.instrumentLoadStatus[controller] = ready;
            let instrumentsLoaded = true;
            for(const controller in this.instrumentLoadStatus) {
                instrumentsLoaded = instrumentsLoaded && this.instrumentLoadStatus[controller];
            }
            this.instrumentsLoaded = instrumentsLoaded;
            if(this.instrumentsLoaded) {
                this.chainControllerOutputs();
                this.setInstrumentsReady(true);
            }
        }
        this.updatePartLoadStatus = (controller, ready) => {
            this.partLoadStatus[controller] = ready;
            let partsLoaded = true;
            for(const controller in this.partLoadStatus) {
                partsLoaded = partsLoaded && this.partLoadStatus[controller];
            }
            this.partsLoaded = partsLoaded;
            this.setPartsReady(this.partsLoaded);
        }
        this.output = new Tone.Gain(1).chain(eq,hpf,lpf);
        this.output.toDestination();
        this.bc = new BassController();
        this.cc = new ChordController(this.updateInstrumentLoadStatus);
        this.dc = new DrumController(this.updateInstrumentLoadStatus, this.updatePartLoadStatus);
        this.mc = new MelodyController(this.updateInstrumentLoadStatus, this.updatePartLoadStatus);
        this.vinyl = new Vinyl(this.updateInstrumentLoadStatus);

        this.loop = new Tone.Loop((time) => {
            this.bc.on = prob(0.70);
            this.cc.on = true;
            this.dc.on = prob(0.85);
            this.mc.on = prob(0.85);
            this.mc.voice = randEl([0,1,2]);
            this.mc.updateInstrument();
        },'8m').start(0);
    }

    chainControllerOutputs() {
        this.bc.output.chain(this.output);
        this.cc.output.chain(this.output);
        this.dc.output.chain(this.output);
        this.mc.output.chain(this.output);
        this.vinyl.output.chain(this.output);
    }

    async generateSong() {
        this.pg.generateProgression();
        this.bc.update(this.pg.getRootsAndFifths(1));
        this.cc.update(this.pg.getShellVoicings(3,true));
        await Promise.all([
            this.dc.update(),
            this.mc.update(this.pg.getChordScales(),this.pg.chords,this.pg.form)
        ]);
    }

    play() {
        Tone.start();
        this.vinyl.start();
        Tone.Transport.start();
    }

    stop() {
        this.vinyl.stop();
        Tone.Transport.stop();
    }


}

export default Master;