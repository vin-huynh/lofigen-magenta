import React, {useState} from 'react';
import './App.css';
import Master from './Controllers/Master';

const m = new Master((instrument, loaded) => console.log(instrument,loaded));

function App() {
  return (
    <div className="App">
      <button onClick={() => m.generateSong()}>generate</button>
      <button onClick={() => m.connectControllerOutputs()}>connect</button>
      <button onClick={() => m.play()}>play</button>
      <button onClick={() => m.stop()}>stop</button>
    </div>
  );
}

export default App;
