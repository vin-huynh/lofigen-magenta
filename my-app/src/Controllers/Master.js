import * as Tone from 'tone';
import ProgressionGenerator from '../Progressions/ProgressionGenerator';
import BassController from './Basses';
import ChordController from './Chords';
import DrumController from './Drums';
import MelodyController from './Melody';
import {prob, randEl} from '../Util/Util';

Tone.Context.lookAhead = 0.5;
Tone.Transport.bpm.value = 80;

class Master {
    constructor(setInstrumentsReady, setPartsReady) {
        this.setInstrumentsReady = setInstrumentsReady;
        this.setPartsReady = setPartsReady;
        this.instrumentsLoaded = false;
        this.partsLoaded = false;
        this.instrumentLoadStatus = {
            chords: false,
            melody: false,
            drums: false,
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
                this.connectControllerOutputs();
                this.setInstrumentsReady(true);
                this.generateSong();
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
        this.output = new Tone.Gain(1);
        this.output.toDestination();
        this.pg = new ProgressionGenerator();
        this.bc = new BassController();
        this.cc = new ChordController(this.updateInstrumentLoadStatus);
        this.dc = new DrumController(this.updateInstrumentLoadStatus, this.updatePartLoadStatus);
        this.mc = new MelodyController(this.updateInstrumentLoadStatus, this.updatePartLoadStatus);

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