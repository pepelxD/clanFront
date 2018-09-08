import Prelude from './components/prelude';
//import * as THREE from 'three';
//import orbitControls from 'three-orbit-controls';

//let OrbitControls = orbitControls(THREE);

//THREE.TDSLoader = loader;

let preloader = document.querySelector('.loading-window');



let prelude = new Prelude('Freedom | on | L2Arcana');
prelude.init(() => {
  preloader.style.display = 'none';
});

