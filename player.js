//Describes player object

import { create } from "domain";


function createPlayer(){
    const player = {
        x: 0,
        y: 0,
        z:0,
        radius: 1,
        color: "blue",
        body: createBody(p),
        speed: 5,


    }
    return player;
}

function createBody(character){
    const geometry = new THREE.SphereGeometry(character.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial( { color: character.color } );
    const sphere = new THREE.Mesh( geometry, material );
    
    sphere.position.set(character.x, character.y, character.z);
    return sphere;

}

function editPlayerColors(player, color){
    player.color = color;
    
}

export {createPlayer, editPlayerColors};

