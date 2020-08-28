import * as Tone from 'tone';
import * as mm from '@magenta/music';
import {Note} from '@tonaljs/tonal';
import vae from '../MagentaModels/Melody/VAE';
import Piano from '../Instruments/Piano/Piano';
import Guitar from '../Instruments/Guitar/Guitar';
import {prob} from '../Util/Util';
import {correct, format} from '../Progressions/MelodyCorrection';

class MelodyController {
    constructor(setReady, setParts) {
        this.setReady = setReady;
        this.setParts = setParts;
        this.loadStatus = {
            guitar: false,
            piano: false,
        };
        this.instrument = {};
        this.output = new Tone.Gain(1);
        this.melody = [];
        this.part = new Tone.Part();
        this.init();
        this.on = true;
        this.voice = 0;
    }

    init() {
        Promise.all([
            vae.initialize(), 
        ]).then(() => this.updateLoadStatus('models'));
        this.guitar = new Guitar(this.updateLoadStatus('guitar'));
        this.piano = new Piano(this.updateLoadStatus('piano'));
        const sw = new Tone.StereoWidener(0.33);
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
        this.setReady('melody', loaded);
    }

    updateInstrument() {
        this.instrument = prob(0.5) ? this.guitar : this.piano;
    }

    async update(chordScales, progression, form) {
        this.setParts('melody',false);
        this.updateInstrument();

        const scalePairs = [];
        for(let i=0; i<chordScales.length; i+=2) {
            scalePairs.push([chordScales[i][0],chordScales[i+1][0]]);
        }
        
        const chords = progression.map(c => c.replace('m/ma7','mM7'));
        const chordPairs = [];
        for(let i=0; i<chords.length; i+=2) {
            chordPairs.push([chords[i],chords[i+1]]);
        }

        const aProg = chordPairs[0];
        const bProg = form[1] === 1 ? chordPairs[4] : chordPairs[8];
        const cProg = chordPairs[12];
        const progs = [aProg,bProg,cProg];
        const seedProgs = form
            .map(e => [e,e,e,e])
            .reduce((a,b) => a.concat(b),[])
            .map(e => progs[e]);

        const aSeq = await vae.sample(1,0.9,{chordProgression: aProg},4,80);
        const bSeq = await vae.sample(1,0.9,{chordProgression: bProg},4,80);
        const cSeq = await vae.sample(1,0.9,{chordProgression: cProg},4,80);
        const seqs = [aSeq,bSeq,cSeq];
        const seedSeqs = form
            .map(e => [e,e,e,e])
            .reduce((a,b) => a.concat(b),[])
            .map(e => seqs[e][0]);
        
        const twoBars = [];
        for(let i=0; i<chordPairs.length; i++) {
            const seedSeq = seedSeqs[i];
            const seedProg = seedProgs[i];
            const z = await vae.encode([seedSeq],{chordProgression: seedProg});
            const res = (await vae.decode(z, 0.6, {chordProgression: chordPairs[i]},4,80))[0];
            const correctedNotes = correct(res.notes,scalePairs[i]);
            twoBars.push({...res, notes: correctedNotes});
        }

        const allBars = mm.sequences.concatenate(twoBars);
        const formatted = format(allBars.notes);

        this.melody = formatted;

        this.updatePart();
        this.setParts('melody',true);
    }

    updatePart() {
        this.part.dispose();
        this.part = new Tone.Part((time,value) => {
            if(this.on) {
                switch(this.voice) {
                    case 0: {
                        this.instrument.trigger(value.note,'1n',time); 
                        break;
                    }
                    case 1: {
                        this.instrument.trigger(Note.transpose(value.note,'8P'),'1n',time);
                        break;
                    }
                    case 2: {
                        this.instrument.trigger(value.note,'1n',time);
                        this.instrument.trigger(Note.transpose(value.note,'8P'),'1n',time);
                        break;
                    }
                    default: break;
                }
            }
        },this.melody).start(0);
        this.part.loop = true;
        this.part.loopStart = 0;
        this.part.loopEnd = '32m';
        this.part.humanize = true;
    }
}

export default MelodyController;