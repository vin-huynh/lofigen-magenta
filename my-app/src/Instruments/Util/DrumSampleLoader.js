export default (arr) => {
    const samples = {};
    arr.forEach((f,i) => samples[i] = f);
    return samples;
}