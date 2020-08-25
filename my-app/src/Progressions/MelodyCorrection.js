import {Midi, Note} from '@tonaljs/tonal'; 
import {note, scale} from 'sharp11';

const correct = (notes, scalePair) => {
    const sc1 = scale.create(scalePair[0].key.fullName,scalePair[0].id);
    const sc2 = scale.create(scalePair[1].key.fullName,scalePair[1].id);
    const ns1 = notes.filter(n => n.quantizedStartStep < 16);
    const ns2 = notes.filter(n => n.quantizedStartStep >= 16);
    return constrainRange([...alignToScale(ns1,sc1),...alignToScale(ns2,sc2)]);
}

const alignToScale = (ns, sc) => {
    return ns.map(n => {
        const nn = note.create(Midi.midiToNoteName(n.pitch));
        return {
            ...n,
            pitch: Midi.toMidi(Note.simplify(sc.nearest(nn.name).fullName + nn.octave))
        };
    });
}

const constrainRange = (notes) => {
    const oct = 12;
    return notes.map(note => {
        let p = note.pitch;

        while(p < 54) {
            p+=oct;
        }
        while(p > 77) {
            p-=oct;
        }

        return {...note, pitch: p};
    });
}

const format = (notes) => {
    return notes.map(n => {
        return {
            time: {'16n': n.quantizedStartStep},
            note: Midi.midiToNoteName(n.pitch),
            duration: {'16n': n.quantizedEndStep - n.quantizedStartStep},
        };
    });
}

export {correct, format};