import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);


//scene.add(new THREE.GridHelper(20, 20, 0x808080, 0x808080));


let loader = new THREE.FontLoader();
var textGeo1, textGeo2, textGeo3;
var morphs = [];
var morphIndex = 0;

var geom;

loader.load('./Feast_of_Flesh.typeface.json', (font) => {
    textGeo1 = new THREE.TextGeometry('Destiny', {
        font: font,
        size: 4,
        height: 1,
        curveSegments: 10,
        bevelEnabled: false,
        bevelSize: 20,
        bevelThickness: 50
    });
    textGeo1.center();
    textGeo2 = new THREE.TextGeometry('и l2Arcana', {
        font: font,
        size: 4,
        height: 1,
        curveSegments: 10,
        bevelEnabled: false,
        bevelSize: 20,
        bevelThickness: 50
    });
    textGeo2.center();
    textGeo3 = new THREE.TextGeometry('ждут тебя', {
        font: font,
        size: 4,
        height: 1,
        curveSegments: 10,
        bevelEnabled: false,
        bevelSize: 20,
        bevelThickness: 50
    });
    textGeo3.center();

    geom = textGeo1;

    var maxLength = Math.max(textGeo1.vertices.length, textGeo2.vertices.length, textGeo3.vertices.length);
    var pointNumber = 30000;
    while(textGeo1.vertices.length < pointNumber) {
      fillWithPoints(textGeo1, 1)
    }
    while(textGeo2.vertices.length < pointNumber) {
      fillWithPoints(textGeo2, 1)
    }
    while(textGeo3.vertices.length < pointNumber) {
      fillWithPoints(textGeo3, 1)
    }

    /* var pointNumber = 30000;
    fillWithPoints(textGeo1, pointNumber)
    fillWithPoints(textGeo2, pointNumber)
    fillWithPoints(textGeo3, pointNumber) */

    console.log(textGeo1.vertices.length);
    console.log(textGeo2.vertices.length);
    console.log(textGeo3.vertices.length);

    createMorph(textGeo1, textGeo2, 8, new THREE.Color(0x00ffff), new THREE.Color(0xffff00));
    createMorph(textGeo2, textGeo3, 5, new THREE.Color(0xffff00), new THREE.Color(0xff00ff));
    createMorph(textGeo3, textGeo1, 10, new THREE.Color(0xff00ff), new THREE.Color(0x00ffff));


    var points = new THREE.Points(geom, new THREE.PointsMaterial({color: 0xf00008, size: 0.1}));
    scene.add(points);
    
    
    render();
});

function createMorph(geomStart, geomEnd, speed, colorStart, colorEnd){

  let duration = 0;
  let tempDist = new THREE.Vector3(); 
  let vertices = [];
  let longestDist = 0;
  
  vertices = geomStart.vertices.map(
  	(v, i) => {
    	
      let nv = v.clone();
      
      tempDist.copy(geomEnd.vertices[i]).sub(nv);
      let dist = tempDist.length();
      longestDist = Math.max(dist, longestDist);
      let dir = new THREE.Vector3().copy(tempDist).normalize();
      
      nv.dir = dir;
      nv.dist = dist;
      return nv;
      
    }
  );
  
  duration = longestDist / speed;
  
	morphs.push(
  	{
    	speed: speed,
      duration: duration,
      vertices: vertices,
      colorStart: colorStart,
      colorEnd: colorEnd
    }
  );
}

var clock = new THREE.Clock();
var currentDuration = 0;
var clampedDirLength = new THREE.Vector3(); // for re-use


function render(){
  requestAnimationFrame(render);
  currentDuration += clock.getDelta();
  textGeo1.vertices.forEach((v, i) => {
  	let morph = morphs[morphIndex];
  	let morphV = morph.vertices[i];
    clampedDirLength		// reusable vector
    	.copy(morphV.dir) // set its value as a normalized direction from the array
      .multiplyScalar(currentDuration * morph.speed)	// multiply it with the time, passed since the beginning of the current morph, and speed (the result is the distance, a scalar value)
      .clampLength(0, morphV.dist); // magic is here: we clamp the length of the vector, thus it won't exceed the limit						
    v.copy(morphV).add(clampedDirLength); // add the vector to the initial coordinates of a point
    //geom.colors[i].copy(morph.colorStart).lerp(morph.colorEnd, clampedDirLength.length() / morphV.dist);
  });
  geom.verticesNeedUpdate = true;
 	geom.colorsNeedUpdate = true;
  
  if (currentDuration >= morphs[morphIndex].duration + 0.5){
  	morphIndex = (morphIndex + 1) % 3;
    currentDuration = 0;
  }
  
  renderer.render(scene, camera);
}





let a = new THREE.Vector3();
let b = new THREE.Vector3();
let c = new THREE.Vector3();
let face = new THREE.Face3();
function isPointInside(point, geometry) {
  let retVal = false;
  for (let i = 0; i < geometry.faces.length; i++) {
    face = geometry.faces[i];
    a = geometry.vertices[face.a];
    b = geometry.vertices[face.b];
    c = geometry.vertices[face.c];
    if (ptInTriangle(point, a, b, c)) {
      retVal = true;
      break;
    }
  }
  return retVal;
}

function ptInTriangle(p, p0, p1, p2) {
  // credits: http://jsfiddle.net/PerroAZUL/zdaY8/1/
  let A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
  let sign = A < 0 ? -1 : 1;
  let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
  let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

  return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}
function setRandomPoint(geometry) {
  var point = new THREE.Vector3(
    THREE.Math.randFloat(geometry.boundingBox.min.x, geometry.boundingBox.max.x),
    THREE.Math.randFloat(geometry.boundingBox.min.y, geometry.boundingBox.max.y),
    THREE.Math.randFloat(geometry.boundingBox.min.z, geometry.boundingBox.max.z)
  );
  if (isPointInside(point, geometry)) {
    geometry.vertices.push(point);
  } else {
    setRandomPoint(geometry);
  }
}
function fillWithPoints(geometry, pointNumber) {
  geometry.computeBoundingBox();
  for (var i = 0; i < pointNumber; i++) {
    setRandomPoint(geometry);
  }
}