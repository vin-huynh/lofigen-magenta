import {drumToMidi} from './MidiMappings';
const visual = {
    //           1   e   &   a   2   e   &   a   3   e   &   a   4   e   &   a       1   e   &   a   2   e   &   a   3   e   &   a   4   e   &   a
    open:   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',    ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' '],
    closed: ['X',' ','X',' ','X',' ','X',' ','X',' ','X',' ','X',' ','X',' ',    'X',' ','X',' ','X',' ','X',' ','X',' ','X',' ','X',' ','X',' '],
    snare:  [' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',    ' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' '],
    kick:   ['X',' ',' ',' ',' ',' ',' ','X','X',' ',' ',' ',' ',' ',' ',' ',    'X',' ',' ',' ',' ',' ','X',' ',' ','X','X',' ',' ',' ',' ',' '],
}

const notes = [];
Object.keys(visual).forEach(t => visual[t].forEach((n,i) => {
    if(n === 'X') {
        notes.push({
            pitch: drumToMidi.get(t),
            quantizedStartStep: i,
            quantizedEndStep: i+1
        });
    }
}));

const seq = {
    notes: notes,
    totalQuantizedSteps: 32,
    quantizationInfo: {stepsPerQuarter: 4}
};

export default seq;