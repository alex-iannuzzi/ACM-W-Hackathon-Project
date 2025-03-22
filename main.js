//Main program
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
	plane.receiveShadow = true;
	return plane;
}

