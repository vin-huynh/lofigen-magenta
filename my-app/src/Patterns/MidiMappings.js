const drumToMidi = new Map([
    ['kick', 36],
    ['snare', 38],
    ['closed', 42],
    ['open', 46],
]);

const midiToDrum = new Map([...drumToMidi].map(e => e.reverse()));

export{drumToMidi, midiToDrum};