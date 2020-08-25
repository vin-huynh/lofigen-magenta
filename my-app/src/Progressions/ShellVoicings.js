import {Interval, Note} from '@tonaljs/tonal';
import {prob} from '../Util/Util';

const twoNote = {
    4: [[1,3],[3,1]],
    5: [[1,4],[4,1]],
};

const threeNote = {
    4: [[1,3,0],[3,1,2]],
    5: [[1,3,4],[3,1,2]],
};

const getShellVoicings = (chords, tonic, oct, extensions) => {
    const bottom = Note.get(tonic+oct).midi;
    const shellType = extensions ? threeNote : twoNote;
    const shellVoicings = [getFirstVoicing(chords[0],bottom,shellType,oct)];
    for(let i=1; i< chords.length; i++) {
        const prev = shellVoicings[i-1];
        shellVoicings.push(getVoicing(chords[i],bottom,shellType,prev));
    }

    return shellVoicings.map(v => v.voicing);
}

const getFirstVoicing = (chord, bottom, shellType, oct) => {
    const idx = prob(0.5) ? 0 : 1;
    const shell = shellType[chord.length][idx];

    const pitchClasses = chord.map(n => Note.get(n).pc);
    const pitchClassVoicing = shell.map(i => pitchClasses[i]);

    let o = oct;
    let voicing = [pitchClassVoicing[0]+o];
    for(let i=1; i<pitchClassVoicing.length; i++) {
        voicing.push(pitchClassVoicing[i]+o);
        while(Note.get(voicing[i]).midi < Note.get(voicing[i-1]).midi) {
            voicing[i] = Note.transpose(voicing[i],'8P');
            o++;
        }
    }

    let min = Note.get(voicing[0]).midi;
    let max = Note.get(voicing[voicing.length-1]).midi;
    while (bottom > min) {
        voicing = voicing.map(Note.transposeBy("8P"));
        min = Note.get(voicing[0]).midi;
        max = Note.get(voicing[voicing.length-1]).midi;
    }
    while (max-bottom > 24) {
        voicing = voicing.map(Note.transposeBy("-8P"));
        min = Note.get(voicing[0]).midi;
        max = Note.get(voicing[voicing.length-1]).midi;
    }
    
    return {chord: chord, voicing: voicing, idx: idx};
}

const getVoicing = (chord, bottom, shellType, prev) => {
    const dist = Interval.distance(chord[0],prev.chord[0]);
    const idx = (dist === '4P' || Interval.invert(dist) === '4P') ? (!prev.idx ? 1 : 0) : prev.idx;
    const shell = shellType[chord.length][idx];

    const pitchClasses = chord.map(n => Note.get(n).pc);
    const pitchClassVoicing = shell.map(i => pitchClasses[i]);

    let oct = Note.get(prev.voicing[0]).oct;
    let voicing = [pitchClassVoicing[0]+oct];
    for(let i=1; i<pitchClassVoicing.length; i++) {
        voicing.push(pitchClassVoicing[i]+oct);
        while(Note.get(voicing[i]).midi < Note.get(voicing[i-1]).midi) {
            voicing[i] = Note.transpose(voicing[i],'8P');
            oct++;
        }
    }

    let min = Note.get(voicing[0]).midi;
    let max = Note.get(voicing[voicing.length-1]).midi;
    while (bottom > min) {
        voicing = voicing.map(Note.transposeBy("8P"));
        min = Note.get(voicing[0]).midi;
        max = Note.get(voicing[voicing.length-1]).midi;
    }
    while (max-bottom > 24) {
        voicing = voicing.map(Note.transposeBy("-8P"));
        min = Note.get(voicing[0]).midi;
        max = Note.get(voicing[voicing.length-1]).midi;
    }

    return {chord: chord, voicing: voicing, idx: idx };
}

export {getShellVoicings};