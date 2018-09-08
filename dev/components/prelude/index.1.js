import * as THREE from 'three';
export default class {
	constructor(header, description) {
		this.header = header;
		this.descriotion = description;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true});
	}
	_drawText(font) {
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
			for (var i = 0; i < pointNumber; i++) {
				setRandomPoint(geometry);
			}
		}
		let textGeo = new THREE.TextGeometry(this.header, {
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

		let tempDist = new THREE.Vector3();
		textGeo.vertices.forEach(vertex => {
			vertex.init = vertex.clone();
			vertex.random = new THREE.Vector3(THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(25));
			vertex.dir = new THREE.Vector3().copy(vertex.init).sub(vertex.random).normalize();
			vertex.dist = tempDist.copy(vertex.init).sub(vertex.random).length();
			vertex.copy(vertex.random);
		});

		textPoints = new THREE.Points(textGeo, new THREE.PointsMaterial({
			color: 0xf00008,
			size: 0.1
		}));
		this.scene.add(textPoints);

		let speed = 10; // единиц в секунду
		let longestDist = 0;
		textGeo.vertices.forEach(vertex => {
			longestDist = Math.max(longestDist, vertex.dist);
		});
		let fullTime = longestDist / speed; // продолжительность анимации определяется по самой длинной дистанции, так как скорость постоянная
		

		var clock = new THREE.Clock();
		var delta = 0;
		var globalTime = 0;
		var clampedDirLength = new THREE.Vector3();
		
		var render = () => {
			var animationId = requestAnimationFrame(render);

			delta = clock.getDelta();
			globalTime += delta;

			textGeo.vertices.forEach(v => {
				clampedDirLength.copy(v.dir).multiplyScalar(globalTime * speed).clampLength(0, v.dist); // clamp the length!
				v.copy(v.random).add(clampedDirLength);
			});
			
			if (globalTime >= fullTime) { // если текущая продолжительность больше или равна заданной, то останавливаем цикл прорисовки или делаем что-то другое
				//cancelAnimationFrame(animationId);
				textGeo.vertices.forEach(vertex => {
					vertex.copy(vertex.init).addScaledVector(vertex.dir, 5 + Math.cos(Date.now() * 0.001) * 5);
				});
				//globalTime = 0;

			}
			textGeo.verticesNeedUpdate = true;

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
		loader.load('./optimer_bold.typeface.json', (font) => {
			audioLoader.load( './dendi.mp3', (buffer) => {
				cb();
				document.body.appendChild(_this.renderer.domElement);
				_this._drawText(font);
				_this._playAudio()
				this.sound.setBuffer( buffer );
				//this.sound.setLoop( true );
				this.sound.setVolume( 0.5 );
				this.sound.play();
			});
			
		});
		function WindowResizeHandler() {
			_this.camera.aspect = window.innerWidth / window.innerHeight;
			_this.camera.updateProjectionMatrix();
			_this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
		window.addEventListener( 'resize', WindowResizeHandler, false );
		
		/* document.body.appendChild(this.renderer.domElement); */

		//window.d = this.scene;

	}

}