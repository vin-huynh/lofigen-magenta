import {Note} from '@tonaljs/tonal';
import {randEl} from '../Util/Util';

const a = [
//    1   e   &   a   2   e   &   a
    ['1',' ','.','1',' ','.',' ',' '],
    [' ',' ',' ','1',' ','.','1',' '],
];

const b = [
//    3   e   &   a   4   e   &   a
    [' ',' ',' ',' ',' ','L',' ',' '],
    [' ',' ',' ',' ','1','L',' ',' '],
];

const getPattern = () => [...randEl(a), ...randEl(b)];
const oct = n => Note.transpose(n,'8P'); 

const getBassline = (rootsAndFifths) => {
    const first = randEl([rootsAndFifths[0][0],oct(rootsAndFifths[0][0])]);
    let leadTo = first;

    const measures = [];
    for(let i=rootsAndFifths.length-1; i>=0; i--) {
        const pattern = getPattern();
        const [root,fifth] = rootsAndFifths[i];
        const notes = [];

        for(let s=0; s<pattern.length; s++) {
            const symbol = pattern[s];
            const leading = randEl([Note.transpose(leadTo,'2m'),Note.transpose(leadTo,'-2m')]);
            let note;
            switch(symbol) {
                case '1': note = randEl([root,oct(root)]); break;
                case 'L': note = randEl([root,fifth,leading]); break;
                default : note = 0; break;
            }
            if(note!==0)
                note = Note.simplify(note);
            notes.push(note);
        }

        const startIdx = pattern.indexOf('1');
        if(i===0) notes[startIdx] = first;
        leadTo = notes[startIdx];

        measures.unshift(notes);
    }
    return measures.reduce((a,b) => a.concat(b), []);
};

export {getBassline};
