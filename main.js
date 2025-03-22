//Main program
import {createPlayer, editPlayerColors} from './player.js';

//Basic code for creating scene
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Create player
const player = createPlayer();
console.log(player);
editPlayerColors(player, "red");

//Function to animate the scene
function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );