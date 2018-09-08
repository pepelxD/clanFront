import * as THREE from 'three';
export default class {
	constructor(text) {
		this.text = text.split(' | ');
		this.textsGeo = [];
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true});
	}
	_drawText(font) {
		let morphs = [];
		let morphIndex = 0;


		let textPoints = null;
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
			for (var i = geometry.vertices.length; i < pointNumber; i++) {
				setRandomPoint(geometry);
			}
		}

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

		function bridge(geos) {
			let length = geos.length;
			for(let i = 0; i < length; i++) {
				if(i === length - 1) {
					createMorph(geos[i], geos[0], 8, new THREE.Color(0x00ffff), new THREE.Color(0xffff00));
					return;
				}
				createMorph(geos[i], geos[i + 1], 8, new THREE.Color(0x00ffff), new THREE.Color(0xffff00));
			}
		}

		this.text.forEach(item => {
			let textGeo = new THREE.TextGeometry(item, {
				font: font,
				size: 4,
				height: 1,
				curveSegments: 10,
				bevelEnabled: false,
				bevelSize: 20,
				bevelThickness: 50
			});
			textGeo.computeBoundingBox();
			textGeo.computeVertexNormals();
			textGeo.center();
			fillWithPoints(textGeo, 30000);

			this.textsGeo.push(textGeo);
		});
		bridge(this.textsGeo);
		





		let tempDist = new THREE.Vector3();
		this.textsGeo[0].vertices.forEach(vertex => {
			vertex.init = vertex.clone();
			vertex.random = new THREE.Vector3(THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(25));
			vertex.dir = new THREE.Vector3().copy(vertex.init).sub(vertex.random).normalize();
			vertex.dist = tempDist.copy(vertex.init).sub(vertex.random).length();
			vertex.copy(vertex.random);
		});




		textPoints = new THREE.Points(this.textsGeo[0], new THREE.PointsMaterial({
			color: 0xf00008,
			size: 0.1
		}));




		this.scene.add(textPoints);

		let speed = 10; // единиц в секунду
		let longestDist = 0;
		this.textsGeo[0].vertices.forEach(vertex => {
			longestDist = Math.max(longestDist, vertex.dist);
		});
		let fullTime = longestDist / speed; // продолжительность анимации определяется по самой длинной дистанции, так как скорость постоянная
		

		var clock = new THREE.Clock();
		var delta = 0;
		var globalTime = 0;
		var clampedDirLength = new THREE.Vector3();
		var currentDuration = 0;
		
		var render = () => {
			var animationId = requestAnimationFrame(render);

			
			
			if (globalTime >= fullTime) { // если текущая продолжительность больше или равна заданной, то останавливаем цикл прорисовки или делаем что-то другое
				//cancelAnimationFrame(animationId);
				/* this.textsGeo[0].vertices.forEach(vertex => {
					vertex.copy(vertex.init).addScaledVector(vertex.dir, 5 + Math.cos(Date.now() * 0.001) * 5);
				}); */
				//globalTime = 0;
				currentDuration += clock.getDelta();
				this.textsGeo[0].vertices.forEach((v, i) => {
					let morph = morphs[morphIndex];
					let morphV = morph.vertices[i];
					clampedDirLength		// reusable vector
						.copy(morphV.dir) // set its value as a normalized direction from the array
					.multiplyScalar(currentDuration * morph.speed)	// multiply it with the time, passed since the beginning of the current morph, and speed (the result is the distance, a scalar value)
					.clampLength(0, morphV.dist); // magic is here: we clamp the length of the vector, thus it won't exceed the limit						
					v.copy(morphV).add(clampedDirLength); // add the vector to the initial coordinates of a point
					//geom.colors[i].copy(morph.colorStart).lerp(morph.colorEnd, clampedDirLength.length() / morphV.dist);
				});
				this.textsGeo[0].verticesNeedUpdate = true;
				this.textsGeo[0].colorsNeedUpdate = true;

				if (currentDuration >= morphs[morphIndex].duration + 0.5 && morphIndex === morphs.length - 1) {
					console.log(morphIndex, 'end animation');
					cancelAnimationFrame(animationId);
				}
				
				if (currentDuration >= morphs[morphIndex].duration + 0.5){
					morphIndex = (morphIndex + 1) % this.textsGeo.length;
					currentDuration = 0;
				}
				
				


			} else {
				delta = clock.getDelta();
				globalTime += delta;

				this.textsGeo[0].vertices.forEach(v => {
					clampedDirLength.copy(v.dir).multiplyScalar(globalTime * speed).clampLength(0, v.dist); // clamp the length!
					v.copy(v.random).add(clampedDirLength);
				});
				this.textsGeo[0].verticesNeedUpdate = true;
			}
			

			this.renderer.render(this.scene, this.camera);
		}
		render();
	}
	_playAudio() {
		let listener = new THREE.AudioListener();
		this.camera.add( listener );
		this.sound = new THREE.Audio( listener );
	}
	init(cb) {
		let _this = this;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		this.camera.position.set(0, 10, 20);
		this.camera.lookAt(this.scene.position);
		let light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set( 0, 0, 1 ).normalize();
		this.scene.add(light);

		let loader = new THREE.FontLoader();
		let audioLoader = new THREE.AudioLoader();
		loader.load('./json/optimer_bold.typeface.json', (font) => {
			audioLoader.load( './assets/dendi.mp3', (buffer) => {
				let t1 = performance.now();
				_this._drawText(font);
				let t2 = performance.now();
				console.log('time: ' + (t2 - t1)/1000)
				_this._playAudio()
				this.sound.setBuffer( buffer );
				//this.sound.setLoop( true );
				this.sound.setVolume( 0.5 );
				this.sound.play();
				cb();
			});
			
		});
		function WindowResizeHandler() {
			_this.camera.aspect = window.innerWidth / window.innerHeight;
			_this.camera.updateProjectionMatrix();
			_this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
		window.addEventListener( 'resize', WindowResizeHandler, false );
		
		document.body.appendChild(this.renderer.domElement);
	}

}