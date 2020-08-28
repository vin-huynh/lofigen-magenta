import React, {useState,useEffect,useRef} from 'react';
import './App.css';
import Master from './Controllers/Master';
import Visualizer from './Components/Visualizer'

function App() {
  const [instrumentsLoaded, setInstrumentsLoaded] = useState(false);
  const [partsLoaded, setPartsLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [generatedFirst, setGeneratedFirst] = useState(false);

  useEffect(() => {
    setLoaded(instrumentsLoaded && partsLoaded);
  },[instrumentsLoaded,partsLoaded]);

  const master = useRef(null);

  useEffect(() => {
    master.current = new Master(setInstrumentsLoaded, setPartsLoaded);
  },[]);

  const togglePlaying = () => {
    if(playing) {
      master.current.stop();
    } else {
      master.current.play();
    }
    setPlaying(!playing);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>LOFI GENERATOR</h1>
        <h3>by vin-huynh</h3>
      </div>

      <div className="colorBox">
        <div className="loadInfo">
          {loaded? '' : (generatedFirst? 'LOADING' : 
            <p className="generateFirst">Click <b>{'>>'}</b> to Generate Your First Song!</p>)}</div>
        <div className="visualizer">
          {loaded? <Visualizer audio={master.current.output}/> : '' }
        </div>
        <div className="gradient"></div>
      </div>

      <div className="buttons">
        <button className="playBtn"
                disabled={!loaded}
                onClick={() => togglePlaying()}>
          <b>{playing? 'Stop' : 'Play'}</b>
        </button>
        <button className="nextBtn"
                disabled={!loaded && generatedFirst}
                onClick={() => {
                  setGeneratedFirst(true);
                  master.current.stop();
                  setPlaying(false);
                  master.current.generateSong(); 
                  setLoaded(false);}}>
          <b>{'>>'}</b>
        </button>
      </div>

      <div className="instructions">
        <p>Click <b>{'>>'}</b> to generate a new song!</p>
        <p>It may take a while, please be patient!</p>
      </div>
      
      <section className="backdrop"></section>
    </div>
  );
}

export default App;
