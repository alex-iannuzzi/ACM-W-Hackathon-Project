//Main program
//Basic code for creating scene
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
renderer.setAnimationLoop( animate );

//VARIABLE DEFINITIONS
const blue = new THREE.Color().setRGB(0, 0, 1);
const red = new THREE.Color().setRGB(1, 0, 0);
const green = new THREE.Color().setRGB(0, 1, 0);
const yellow = new THREE.Color().setRGB(1, 1, 0);
const white = new THREE.Color().setRGB(1, 1, 1);
const black = new THREE.Color().setRGB(0, 0, 0);

//FUNCTION DEFINITIONS

//Function to animate the scene
function animate() {
	renderer.render( scene, camera );
}

const player = createPlayer();
function createPlayer(){
    const player = {
        x: 0,
        y: 0,
        z:0,
		radius: 1,
        color: blue,
        body: null,
        speed: 5,

    }
	player.body = createNewBody(player.radius, player.color, player.x, player.y, player.z);
	
    return player;
}

function createNewBody(radius, color, x, y, z){
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStahdardMaterial( { color: color} );
    const sphere = new THREE.Mesh( geometry, material );
    
    sphere.position.set(x, y, z);
    return sphere;
}

function editPlayerColors(player, color){
    player.color = color;
}