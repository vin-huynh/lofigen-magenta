import SampleLoader from '../Util/SampleLoader';
const path = `${process.env.PUBLIC_URL}/Samples/Piano/`;
const notes = {
    "A":    [1,2,3,4,5,6],
    "C":    [1,2,3,4,5,6],
    "D#":   [1,2,3,4,5,6],
    "F#":   [1,2,3,4,5,6],
};
const samples = SampleLoader(path, notes)
export {samples};