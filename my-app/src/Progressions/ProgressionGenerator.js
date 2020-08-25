import {Key, Progression, Chord, Note} from '@tonaljs/tonal';
import {chord} from 'sharp11';
import {generateProgression, generateForm} from './Progressions';
import {getShellVoicings} from './ShellVoicings';
import {getRootsAndFifths} from './Roots';
import {randEl} from '../Util/Util';
import pcs from './PitchClasses';

class ProgressionGenerator {
    constructor() {
        this.key = {};
        this.progression = [];
        this.chords = [];
        this.form = [];
        this.generateProgression();
        this.updateChords();
    }

    generateProgression() {
        this.key = Key.majorKey(randEl(pcs));
        this.form = generateForm();
        this.progression = generateProgression(this.form);
        this.updateChords();
    }

    updateChords() {
        this.chords = Progression
            .fromRomanNumerals(this.key.tonic,this.progression)
            .map(c => Chord.get(c))
            .map(c => {
                const tonic = Note.simplify(c.tonic) 
                let symbol = c.aliases[0];
                if(symbol === "maj7") {
                    symbol = "M7";
                }
                if(symbol === "dim7") {
                    symbol = "o7";
                }
                return tonic + symbol;
            });
    }

    getChordScales() {
        return this.chords.map(c => chord.create(c).scales());
    }

    getChordNotes(oct) {
        return this.chords.map(c => chord.create(c,oct).chord.map(n => Note.simplify(n.fullName)));
    }

    getShellVoicings(oct, extensions) {
        return getShellVoicings(this.getChordNotes(), this.key.tonic, oct, extensions);
    }

    getRootsAndFifths(oct) {
        return getRootsAndFifths(this.getChordNotes(),this.key.tonic, oct);
    }
}

export default ProgressionGenerator;