
//Basic code for creating scene
import * as THREE from 'three';
import { time, velocity } from 'three/tsl';

//to create font for username 
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const loader = new FontLoader();

//Detecting start and pause of game
var start = false;
var pause = false;

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

//Object value definitions
const seedEXP = 10;
const seedKindness = 10;

const shovelEXP = 10;
const shovelDiligence = 10;

//Describe background
scene.background = new THREE.Color( 0xF591C3); //Pink background
scene.fog = new THREE.Fog( 0xf9efde5, 10, 15); //Light orange fog

const floor = createFloor();
scene.add(floor);

//Adding light to the scene
const sunlight = new THREE.DirectionalLight( 0xffffff, 1 );
sunlight.position.set( 0, 2, 1 );
sunlight.castShadow = true;
scene.add( sunlight );

scene.add( new THREE.AmbientLight( 0x404040 ) ); // soft white light

//Adding Player
var player = createPlayer();
scene.add(player.body);


//Adding walls
createRoom();

//Adding items
const seeds = createSeeds(1, 0, -2, green);
scene.add(seeds);

//Setting camera position
camera.position.z = 5;
camera.position.y = 2;

//Animation loop
renderer.setAnimationLoop( animate );

//EVENT LISTENERS - reactions to keypresses, interactions with HTML elements, etc.
//Increase player speed in given direction when a key is pressed (W,A,S,D movement controls)
//TODO: Add collision detection, compare speed to total speed, not each direction
document.addEventListener('keypress', function(event) {
	switch(event.key) {
		case "w":
			if (getCurrVelocity(player) < player.speed && getCurrVelocity(player) > -player.speed && detectCollision(player) != 1) {
				player.velocity.z -= 0.1;
			}
			break;
		case "s":
			if (getCurrVelocity(player) < player.speed && getCurrVelocity(player) > -player.speed && detectCollision(player) != 2) {
				player.velocity.z += 0.1;
			}
			player.velocity.z += 0.1;
			break;
		case "a":
			if (getCurrVelocity(player) < player.speed && getCurrVelocity(player) > -player.speed && detectCollision(player) != 3) {
				player.velocity.x -= 0.1;
			}
			break;
		case "d":
			if (getCurrVelocity(player) < player.speed && getCurrVelocity(player) > -player.speed && detectCollision(player) != 4) {
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

//Change player color when selected from HTML element "colorPicker"
document.getElementById("colorPicker").addEventListener("input", function(event) {
	editPlayerColors(player, new THREE.Color(event.target.value));
});

//Change player username when entered into HTML element "username"
document.getElementById("username").addEventListener("input", function(event) {
	player.name = event.target.value;;
	displayPlayerName(player.name);
});

//Start the game when start button is pressed
document.getElementById("start-button").addEventListener("click", function(event) {
	start = true;
});

//Pause the game when pause button is pressed
document.getElementById("pause-button").addEventListener("click", function(event) {
	pause = true;
});

//Restart the game when restart button is pressed
document.getElementById("restart-button").addEventListener("click", function(event) {
	
	start = false;
});

//FUNCTION DEFINITIONS



//Function to animate the scene
function animate() {
	if (detectCollision == 1 || detectCollision == 2 || detectCollision == 3 || detectCollision == 4){
		player.velocity.x = 0;
		player.velocity.z = 0;
	}
	else{
		player.body.position.x += player.velocity.x;
		player.body.position.z += player.velocity.z;
	}

	/* display avatar name 
	
		if (player.name != null){
			displayPlayerName(player.name);
		}
		*/
		
	//Slight up and down bobbing motion of player
	//player.body.position.y += Math.sin(time * 5) * 0.05;

	//Camera follows player
	var playerDirection = new THREE.Vector3(player.velocity.x, 0, player.velocity.z);
	playerDirection.normalize();
	const cameraOffset = new THREE.Vector3(0.0, 2.0, 5.0); // NOTE Constant offset between the camera and the target
	const objectPosition = new THREE.Vector3();
	player.body.getWorldPosition(objectPosition);
	camera.position.copy(objectPosition).add(cameraOffset);

	renderer.render( scene, camera );
}

//Collision detection function
//TODO: Add different collision detection for different objects, and actually make this work lol
function detectCollision(player){
	scene.children.forEach(function(object){
		if (object != player.body){
			//Detect collisions right
			if (player.body.position.x + player.radius > object.position.x - object.scale.x/2) {
				//Collision detected, stop player movement
				return 4;
			}
			//Detect collisions left
			if (player.body.position.x - player.radius < object.position.x + object.scale.x/2) {
				//Collision detected, stop player movement
				return 3;
			}
			//Detect collisions front
			if (player.body.position.z - player.radius < object.position.z + object.scale.z/2) {
				//Collision detected, stop player movement
				return 1;
			}	
			//Detect collisions back
			if (player.body.position.z + player.radius > object.position.z - object.scale.z/2) {
				//Collision detected, stop player movement
				return 2;
			}
		}
	});
}

//Create player object
function createPlayer(){
    var player = {
		name: "Player1",
        position: new THREE.Vector3(0, 0, 0),
		velocity: new THREE.Vector3(0, 0, 0),
		radius: 1,
        color: blue,
        body: createNewBody(1, blue, 0, 0, 0),

        speed: 1,
		kindness: 0,
		fashion: 0,
		knowledge: 0,
		diligence: 0,
    }
	player.body.castShadow = true;
	player.body.receiveShadow = true;
	player.body.position.set(player.position.x, player.position.y, player.position.z);
		
    return player;
}

//Create a new NPC body (sphere)
function createNewBody(radius, color, x, y, z){
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial( { color: color } );
    const sphere = new THREE.Mesh( geometry, material );
    
    sphere.position.set(x, y, z);
    return sphere;
}

/*
function displayPlayerName(name) {
	loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
		const geometry = new TextGeometry(name, {
			font: font,
			size: 0.2,
			height: 0.01,
		});

	});

	
}
*/
//Calculate the current total velocity of an object
function getCurrVelocity(obj){
	return Math.sqrt(obj.velocity.x * obj.velocity.x + obj.velocity.z * obj.velocity.z);
}

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
	const material = new THREE.MeshStandardMaterial( { color: white } );
	const plane = new THREE.Mesh( geometry, material );

	plane.rotation.x = -Math.PI / 2;
	plane.position.x = 0;
	plane.position.y = -1;

	plane.receiveShadow = true;
	return plane;
}

function createRoom(){
	const wall1 = createWall(5, 0, 0, 1, 10, 10);
	const wall2 = createWall(-5, 0, 0, 1, 10, 10);
	const wall3 = createWall(-2, 0, -5, 5, 10, 1);
	scene.add(wall1);
	scene.add(wall2);
	scene.add(wall3);
	
}

function createWall(x, y, z, w, h, l){
	const geometry = new THREE.BoxGeometry(w, h, l);
	const material = new THREE.MeshBasicMaterial( { color: red } );
	const cube = new THREE.Mesh( geometry, material );

	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;

	return cube;
	
}

function createItem(x, y, z, color){
	const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const material = new THREE.MeshBasicMaterial( { color: color } );
	const item = new THREE.Mesh( geometry, material );

	item.position.x = x;
	item.position.y = y;
	item.position.z = z;

	return item;
	
}

function createSeeds(x, y, z){
	const seeds = createItem(x, y, z, green);

	return seeds;
	
}