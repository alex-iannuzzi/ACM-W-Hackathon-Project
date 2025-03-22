//Main program
//Basic code for creating scene
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Basic olor Definitions
const blue = new THREE.Color().setRGB(0, 0, 1);
const red = new THREE.Color().setRGB(1, 0, 0);
const green = new THREE.Color().setRGB(0, 1, 0);
const yellow = new THREE.Color().setRGB(1, 1, 0);
const white = new THREE.Color().setRGB(1, 1, 1);
const black = new THREE.Color().setRGB(0, 0, 0);

//Describe background
scene.background = new THREE.Color( 0xF591C3); //Pink background
scene.fog = new THREE.Fog( 0xf9efde5, 10, 15); //Light orange fog

const floor = createFloor();
scene.add(floor);

//Adding light to the scene
const sunlight = new THREE.DirectionalLight( 0xffffff, 1 );
sunlight.position.set( 5, 5, 5 ).normalize();
scene.add( sunlight );

scene.add( new THREE.AmbientLight( 0x404040 ) ); // soft white light

//Testing cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//Adding Player
var player = createPlayer();
scene.add(player.body);

//Setting camera position
camera.position.z = 5;
camera.position.y = 2;

//Animation loop
renderer.setAnimationLoop( animate );


//FUNCTION DEFINITIONS

//Function to animate the scene
function animate() {
	renderer.render( scene, camera );
}

function createPlayer(){
    var player = {
		name: "Player1",
        x: 0,
        y: 0,
        z:0,
		radius: 1,
        color: blue,
        body: createNewBody(1, blue, 0, 0, 0),

        speed: 1,
		kindness: 0,
		fashion: 0,
		knowledge: 0,
    }
		
    return player;
}

function createNewBody(radius, color, x, y, z){
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial( { color: color } );
    const sphere = new THREE.Mesh( geometry, material );
    
    sphere.position.set(x, y, z);
    return sphere;
}

function editPlayerColors(player, color){
    player.color = color;
}

function createFloor(){
	const geometry = new THREE.PlaneGeometry(100, 100);
	const material = new THREE.MeshStandardMaterial( { color: white } );
	const plane = new THREE.Mesh( geometry, material );

	plane.rotation.x = -Math.PI / 2;
	plane.position.x = 0;
	plane.position.y = -1;
	return plane;
}

