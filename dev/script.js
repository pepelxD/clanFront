
import Prelude from './components/prelude';
import Clan from './js/clanInfo.js';
//import * as THREE from 'three';
//import orbitControls from 'three-orbit-controls';

//let OrbitControls = orbitControls(THREE);

//THREE.TDSLoader = loader;

let preloader = document.querySelector('.loading-wrapper');
let clanBox = document.querySelector('main');


let prelude = new Prelude('Freedom | on | L2Arcana');
/* prelude.init(() => {
  preloader.remove();
});
 */

let clan = new Clan(clanBox, 'clan_name', 'clan_info');
clan.init();
