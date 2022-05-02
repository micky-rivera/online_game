import {useEffect} from 'react';
import Map from '../game_files/Map';
import Player from '../game_files/player';
import Foreign from '../game_files/foreign';

let mapLoaded = false;

function GameCanvas() {

    useEffect(()=>{
        if (!mapLoaded) {
            const map = new Map({
                element: document.querySelector('.game-container')
            });
            
            map.init();
            mapLoaded = true;
        }
    }, []);

  return (
    <>
        <div className="game-container">
            <canvas className="game-canvas" width="352" height="198"></canvas>
        </div>
    </>
  );
}

export default GameCanvas;
