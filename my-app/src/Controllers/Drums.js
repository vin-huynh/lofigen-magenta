import * as Tone from 'tone';
import {Kicks, Snares, Open, Closed, Claps, Percs} from '../Instruments/Drums/Drums';
import vae from '../MagentaModels/Drums/VAE';
import pattern from '../Patterns/Drums';
import { midiToDrum } from '../Patterns/MidiMappings';

class DrumController {
    constructor(setReady,setParts) {
        this.setParts = setParts;
        this.setReady = setReady;
        this.loadStatus = {
            kicks: false,
            snares: false,
            open: false,
            closed: false,
            claps: false,
            percs: false,
            models: false
        };
        this.tracks = {
            kicks: true,
            snares: true,
            closed: true,
            open: true,
            claps: true,
            percs: true,
        }
        this.output = new Tone.Gain(1);
        this.drumPattern = [];
        this.part = new Tone.Part();
        this.init();
        this.on = true;
    }

    init() {
        vae.initialize().then(() => this.updateLoadStatus('models'));
        this.kicks = new Kicks(this.updateLoadStatus('kicks'));
        this.snares = new Snares(this.updateLoadStatus('snares'));
        this.open = new Open(this.updateLoadStatus('open'));
        this.closed = new Closed(this.updateLoadStatus('closed'));
        this.claps = new Claps(this.updateLoadStatus('claps'));
        this.percs = new Percs(this.updateLoadStatus('percs'));
        this.kicks.output.chain(this.output);
        this.snares.output.chain(this.output);
        this.open.output.chain(this.output);
        this.closed.output.chain(this.output);
        this.claps.output.chain(this.output);
        this.percs.output.chain(this.output);
    }

    updateLoadStatus(type) {
        this.loadStatus[type] = true;
        let loaded = true;
        for(const t in this.loadStatus) {
            loaded = this.loadStatus[t] && loaded;
        }
        this.setReady('drums', loaded);
    }
    
    async update() {
        this.setParts('drums',false);
        const fseq = [];
        let z = await vae.encode([pattern]);
        const seq = await vae.decode(z, 1.2, undefined, 4, 80);
        const seq2 = await vae.decode(z, 1.4, undefined, 4, 80);
        seq[0].notes.forEach(n => {
            fseq.push([{"16n": n.quantizedStartStep},midiToDrum.get(n.pitch)]);
        });
        seq2[0].notes.forEach((n,i) => {
            const step = n.quantizedStartStep+32;
            if(step<64)
                fseq.push([{"16n": step},midiToDrum.get(n.pitch)]);
        });
        this.drumPattern = fseq;

        this.kicks.update();
        this.snares.update();
        this.open.update();
        this.claps.update();
        this.claps.update();
        this.percs.update();
        
        this.updatePart();
        this.setParts('drums',true);
    }

    updatePart() {
        this.part.dispose();
        this.part = new Tone.Part((time,type) => {
            const t = Tone.Time(time) + Tone.Time('32n');
            if(this.on) {
                switch(type) {
                    case 'kick': {
                        if(this.tracks.kicks)
                            this.kicks.trigger(t);
                        break;
                    }
                    case 'snare': {
                        if(this.tracks.snares)
                            this.snares.trigger(t);
                        if(this.tracks.claps)
                            this.claps.trigger(t);
                        break;
                    }
                    case 'closed': {
                        if(this.tracks.closed)
                            this.closed.trigger(t);
                        break;
                    }
                    case 'open': {
                        if(this.tracks.open)
                            this.open.trigger(t);
                        break;
                    }
                    default: break;
                }
                if(Math.random()<0.2 && this.tracks.percs) {
                    this.percs.trigger(t);
                }
            }
        },this.drumPattern).start(0);
        this.part.loop = true;
        this.part.loopStart = 0;
        this.part.loopEnd = '4m';
        this.part.humanize = true;
    }
}

export default DrumController;