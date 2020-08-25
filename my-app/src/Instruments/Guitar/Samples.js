import SampleLoader from '../Util/SampleLoader';
const path = `${process.env.PUBLIC_URL}/Samples/Guitar/`;
const notes = {
    "A":    [2,3,4],
    "A#":   [2,3,4],
    "B":    [2,3,4],
    "C":    [3,6],
    "C#":   [3],
    "D":    [3,4,5],
    "D#":   [3,4,5],
    "E":    [2,3,4,5],
    "F":    [2,3,4],
    "F#":   [2,3,4],
    "G":    [2,3,4],
    "G#":   [2,3,4],
};

const samples = SampleLoader(path,notes);

export {samples};