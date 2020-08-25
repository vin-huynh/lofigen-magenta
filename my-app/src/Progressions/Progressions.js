import {randEl, prob} from '../Util/Util';

const tonic1 = [1,3];
const tonic2 = [6,4];
const iiv = [2,5];
const backdoor = [4,7];

const generateTurnaround = () => {
    const turnaround = [];

    const pushTonic = () => { 
    turnaround.push(randEl(tonic1));
        if(prob(0.85)){
            turnaround.push(randEl(tonic2));
        } else {
            turnaround.push(turnaround[0]);
        }
    };

    const pushTension = () => {
        if(prob(0.6)) {
            turnaround.push(iiv[0],iiv[1]);
        } else {
            turnaround.push(backdoor[0],backdoor[1]);
        }
    }

    let pushFour = prob(0.5) ? 
    () => {
        pushTonic();
        pushTension();
    } : () => {
        pushTension();
        pushTonic();
    };

    for(let i=0; i<2; i++) {
        pushFour();
    }
    
    return turnaround;
}

const chords = {
    1: {
        dia:  'IM7',
        subWeight: 0.33,
        subs: ['IΔ9']
    },
    2: {
        dia:  'IIm7',
        subWeight: 0.15,
        subs: ['IIm9','II7','II9','II7b9','bVIM7','bVIΔ9','#IVh7']
    },
    3: {
        dia:  'IIIm7',
        subWeight: 0.15,
        subs: ['III7','III7b9','IIIh7',
               '#Vo7']
    },
    4: {
        dia:  'IVM7',
        subWeight: 0.25,
        subs: ['IVΔ9']
    },
    5: {
        dia:  'V7',
        subWeight: 0.3,
        subs: ['V9','V7b9',
               'bII7','bII9','bII7b9','bIIM7','bIIΔ9']
    },
    6: {
        dia:  'VIm7',
        subWeight: 0.6,
        subs: ['VIm9','VI7','VI9','VI7b9',
               'bVI7','bVI9','bVI7b9',
               'bIIIM7','bIII7','bIII9','bIII7b9','bIIIo7',
               'Io7','#Io7']
    },
    7: {
        dia:  'VIIh7',
        subWeight: 0.3,
        subs: ['VII7','VII7b9','VIIo7',
               'bVII7','bVII9','bVII7b9',
               'IVm7','IVm9','IVmM7','IVmM9',
               '#IIo7']
    }
}

const forms = [
    [0,0,1,0],
    [0,1,0,2]
];

const generateForm = () => randEl(forms);

const generateProgression = (form) => {
    const sections = [];
    for(let i=0; i<3; i++) {
        sections.push(generateTurnaround());
    }

    const progression = [];
    for(let i=0; i<form.length; i++) {
        progression.push(applySubstitutions(sections[form[i]]));
    }

    return progression.reduce((a,b) => a.concat(b), []);
}

const applySubstitutions = section => section.map((c,i) => {
        const chord = chords[c];
        if(prob(chord.subWeight) && i!==0){
            return randEl(chord.subs);
        } else {
            return chord.dia;
        }
});

export {generateProgression, generateForm};