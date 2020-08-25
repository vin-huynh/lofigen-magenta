export default (path, notes) => {
    const samples = {};
    const keys = Object.keys(notes)
        .map(ltr => notes[ltr].map(oct => ltr+oct))
        .reduce((a,b) => a.concat(b), []);
    
    keys.forEach(note => {
        const fileName = note.includes("#") ? note.replace("#","s") : note;
        samples[note] = path+fileName+".mp3";
    });

    return samples;
}