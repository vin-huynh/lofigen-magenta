import * as Tone from 'tone';
const path = `${process.env.PUBLIC_URL}/Samples/Vinyl.wav`;
const vol = new Tone.Volume(-12);

class Vinyl {
    constructor(cb) {
        this.player = new Tone.Player(path, () => cb('vinyl',true));
        this.player.loop = true;
        this.output = new Tone.Gain(1);
        this.player.chain(vol, this.output);
    }

    start = () => {
        this.player.start(0);
    }

    stop = () => {
        this.player.stop();
    }
}

export default Vinyl;