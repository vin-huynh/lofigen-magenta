import {Note, Interval} from '@tonaljs/tonal';
import {prob} from '../Util/Util';

const getRootsAndFifths = (chords, tonic, oct) => {
    const center = Note.get(tonic+oct).midi;
    return chords.map(chord => {
        const fifthDist = Interval.distance(chord[0],chord[2]);
        const pc = Note.get(chord[0]).pc;
        let root = pc+oct;
        let pos = Note.get(root).midi;
        // all roots above center
        while(pos<center) {
            root = Note.transpose(root,"8P");
            pos = Note.get(root).midi;
        }
        // all roots no more than an octave above center
        while(pos-center>12) {
            root = Note.transpose(root,"-8P");
            pos = Note.get(root).midi;
        }
        // roots past the fifth can be below center
        if(pos-center>6 && prob(0.5)) {
            root = Note.transpose(root,"-8P");
            pos = Note.get(root).midi;
        }
        return [root, Note.transpose(root,fifthDist)];
    });
}



export {getRootsAndFifths};