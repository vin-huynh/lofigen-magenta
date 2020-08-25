const claps = [
    'Cymatics - Lofi Clap 1.wav',
    'Cymatics - Lofi Clap 2.wav',
    'Cymatics - Lofi Clap 3.wav',
    'Cymatics - Lofi Clap 4.wav',
    'Cymatics - Lofi Clap 6.wav',
    'bubbleclap.wav',
    'bubbleclap2.wav',
    'clap1.wav',
    'clapp.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/claps/${f}`);

const closed = [
    'Cymatics - Lofi Closed Hihat 1.wav',
    'Cymatics - Lofi Closed Hihat 2.wav',
    'Cymatics - Lofi Closed Hihat 3.wav',
    'Cymatics - Lofi Closed Hihat 4.wav',
    'Cymatics - Lofi Closed Hihat 5.wav',
    'hat.wav',
    'Oversampled_dd_hihat_01.wav',
    'Oversampled_dd_hihat_02.wav',
    'Oversampled_dd_hihat_03.wav',
    'Oversampled_dd_hihat_04.wav',
    'Oversampled_dd_hihat_05.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/closed/${f}`);

const open = [
    'Cymatics - Lofi Open Hihat 1.wav',
    'Cymatics - Lofi Open Hihat 2.wav',
    'Cymatics - Lofi Open Hihat 3.wav',
    'Cymatics - Lofi Open Hihat 4.wav',
    'Cymatics - Lofi Open Hihat 5.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/open/${f}`);

const kicks = [
    'Oversampled_dd_kick_01.wav',
    'Oversampled_dd_kick_02.wav',
    'Oversampled_dd_kick_03.wav',
    'Oversampled_dd_kick_04.wav',
    'Oversampled_dd_kick_05.wav',
    'weirdkick.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/kicks/${f}`);

const percs = [
    'Cymatics - Lofi Percussion 1.wav',
    'Cymatics - Lofi Percussion 2.wav',
    'Cymatics - Lofi Percussion 3.wav',
    'Cymatics - Lofi Percussion 4.wav',
    'Cymatics - Lofi Percussion 5.wav',
    'Cymatics - Lofi Percussion 6.wav',
    'Cymatics - Lofi Percussion 7.wav',
    'Cymatics - Lofi Percussion 8.wav',
    'paaaah.wav',
    'paah.wav',
    'pluip.wav',
    'scrchpt.wav',
    'scrshhrrttt.wav',
    'scrshht.wav',
    'tic.wav',
    'ting.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/percs/${f}`);

const snares = [
    'Cymatics - Lofi Snare 14 - A.wav',
    'Oversampled_dd_snare_01.wav',
    'Oversampled_dd_snare_02.wav',
    'Oversampled_dd_snare_03.wav',
    'Oversampled_dd_snare_04.wav',
    'Oversampled_dd_snare_05.wav',
    'snare.wav',
].map(f => `${process.env.PUBLIC_URL}/Samples/Drums/snares/${f}`);

export {claps, kicks, open, closed, percs, snares};