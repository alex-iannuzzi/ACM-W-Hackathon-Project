
//Basic code for creating scene
import * as THREE from 'three';
import { time, velocity } from 'three/tsl';
//to create font for username 
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

let avatarName; 
let font;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Basic color Definitions
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

//Adding Player
var player = createPlayer();
scene.add(player.body);


//Adding walls
const wall1 = createWall(5, 0, 0);
scene.add(wall1);

//Setting camera position
camera.position.z = 5;
camera.position.y = 2;

//Animation loop
renderer.setAnimationLoop( animate );


//EVENT LISTENERS
//Increase player speed in given direction when a key is pressed (W,A,S,D movement controls)
//TODO: Add collision detection, compare speed to total speed, not each direction
document.addEventListener('keypress', function(event) {
	switch(event.key) {
		case "w":
			detectCollision(player);
			if (player.velocity.z < player.speed && player.velocity.z > -player.speed) {
				player.velocity.z -= 0.1;
			}
			break;
		case "s":
			detectCollision(player);
			if (player.velocity.z < player.speed && player.velocity.z > -player.speed) {
				player.velocity.z += 0.1;
			}
			player.velocity.z += 0.1;
			break;
		case "a":
			detectCollision(player);
			if (player.velocity.x < player.speed && player.velocity.x > -player.speed) {
				player.velocity.x -= 0.1;
			}
			break;
		case "d":
			detectCollision(player);
			if (player.velocity.x < player.speed && player.velocity.x > -player.speed) {
				player.velocity.x += 0.1;
			}
			break;
		default:
			break;
	}
});

//Slow down and stop player when a key is released
document.addEventListener('keyup', function(event) {
	switch(event.key) {
		case "w":
			if (player.velocity.z < 0) {
				player.velocity.z =0;
			}
			player.velocity.z = 0;
			break;
		case "s":
			if (player.velocity.z > 0) {
				player.velocity.z = 0;
			}
			break;
		case "a":
			player.velocity.x = 0;
			break;
		case "d":
			player.velocity.x = 0;
			break;
		default:
			break;
	}
});

//FUNCTION DEFINITIONS



//Function to animate the scene
function animate() {
	player.body.position.x += player.velocity.x;
	player.body.position.z += player.velocity.z;
	
	// display avatar name 
	
		if (avatarName) {
			avatarName.position.set(
				player.body.position.x, 
				player.body.position.y + 2,  
				player.body.position.z
			);
		}
		
	//Slight up and down bobbing motion of player
	//player.body.position.y += Math.sin(time * 5) * 0.05;

	renderer.render( scene, camera );
}

//Collision detection function
//TODO: Add different collision detection for different objects, and actually make this work lol
function detectCollision(player){
	scene.children.forEach(function(object){
		if (object != player.body){
			//Detect collisions left and right, stop player from moving
			if (player.body.position.x + player.radius > object.position.x - object.scale.x/2 &&
			player.body.position.x - player.radius < object.position.x + object.scale.x/2) {
				//Collision detected, stop player movement
				player.velocity.x = 0;
			
			}
			//Detect collisions up and down, stop player from moving
			if (player.body.position.z + player.radius > object.position.z - object.scale.z/2 &&
			player.body.position.z - player.radius < object.position.z + object.scale.z/2) {
				player.velocity.z = 0;
			}
		}
	});
}

function createPlayer(){
    var player = {
		name: "Player1",
        position: {x: 0, y: 0, z: 0},
		velocity: {x: 0, y: 0, z: 0},
		radius: 1,
        color: blue,
        body: createNewBody(1, blue, 0, 0, 0),

        speed: 1,
		kindness: 0,
		fashion: 0,
		knowledge: 0,
    }
	player.body.castShadow = true;
	player.body.receiveShadow = true;
	player.body.position.set(player.position.x, player.position.y, player.position.z);
		
    return player;
}


function createNewBody(radius, color, x, y, z){
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial( { color: color } );
    const sphere = new THREE.Mesh( geometry, material );
    
    sphere.position.set(x, y, z);
    return sphere;
}

//trying to set the player name to be the input name from html
function setPlayerName(name) {
	if (avatarName) {
		
	enterBox();
	const geometry = new TextGeometry(name, {
		font: font,
		size: 0.1,
		height: 0.01
	});
	geometry.center();
	}
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	avatarName = new THREE.Mesh(geometry, material);

	scene.add(avatarName);
}

const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (loadedFont) {
	font = loadedFont;
	setPlayerName(player.name)
});






function updateDiscretePlayerPosition(x, y, z){
	player.position.x = x;
	player.position.y = y;
	player.position.z = z;

	player.body.position.x = player.position.x;
	player.body.position.y = player.position.y;
	player.body.position.z = player.position.z;
}

function updatePlayerVelocity(x, y, z){
	player.velocity.x = x;
	player.velocity.y = y;
	player.velocity.z = z;
}

function editPlayerColors(player, color){
    player.color = color;
	player.body.material.color = color;
}


function createFloor(){
	const geometry = new THREE.PlaneGeometry(100, 100);
	const material = new THREE.MeshBasicMaterial( { color: white } );
	const plane = new THREE.Mesh( geometry, material );

	plane.rotation.x = -Math.PI / 2;
	plane.position.x = 0;
	plane.position.y = -1;
	return plane;
}

function createWall(x, y, z){
	const geometry = new THREE.BoxGeometry(1, 2, 10);
	const material = new THREE.MeshBasicMaterial( { color: red } );
	const cube = new THREE.Mesh( geometry, material );

	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;

	return cube;
	
}

function createItem(x, y, z){
	const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const material = new THREE.MeshBasicMaterial( { color: green } );
	const cube = new THREE.Mesh( geometry, material );

	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;

	return cube;
	
}