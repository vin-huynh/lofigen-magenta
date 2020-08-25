const randEl = arr => arr[Math.floor(Math.random()*arr.length)];
const prob = p => Math.random() < p;

export {randEl, prob};