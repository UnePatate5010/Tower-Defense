import { start } from 'repl';

import * as A from './actors.js';
import * as C from './characters.js';
import * as D from './display.js';
import * as M from './monster.js';
import * as S from './structures.js';
import * as W from './world.js';
import * as T from './tower.js';

// Define world shape
const width = 15;
const height = 15;
const nb_add_points = 6;
const world = W.initializeWorld(height, width, height);         // initialize the world
const startPoint = W.getRandomStartPoint(world, height, width); // get a random startpoint

// get a random endpoint that is far from the startpoint
const endPoint = W.getRandomEndPoint(world, height, width, startPoint);

// get a list of position that make the path from start position to end position
const path = W.createPath_N(A.get_position(startPoint), A.get_position(endPoint), height, width, 6);

const worldPath = W.copy_path_into_world(path, world); // Apply the path to the world
let worldVar;

let hearts = 100; // player hearts
const maxTurns = 20;
let turns = 0;
let numberMonsters = 100; // the max number of monsters you can spawn
let numberTowers = 20;   // the max number of towers you can spawn

// the list of monsters that are currently in the world
let listMonsters: S.List<A.Actor> =
    S.cons(A.set_position(C.mudmanActor, A.get_position(startPoint)), S.nil);
// the list of towers that are currently in the world

const first_tower_pos = T.getRandomTowerPos(worldPath, height, width);
const first_tower = A.set_position(C.tower1Actor, first_tower_pos);
let listTowers: S.List<A.Actor> =  S.cons(A.set_target(first_tower, T.calcul_target(first_tower, path)), S.nil);

let current_spawner = C.spawnerActor;
let tower_spawner = C.spawnerActor;
let tower_targets:S.List<A.Position> = A.get_target(S.head(listTowers));

while (hearts > 0 && !S.isEmpty(listMonsters) && turns < maxTurns) {
    if (numberMonsters > 0) { // test if we can still spawn monsters
        // change the list of monters that are currently in the world and lower the number of monster by 1
        [listMonsters, numberMonsters, current_spawner] = M.spawn(listMonsters, current_spawner, path, numberMonsters);
    }
    if (numberTowers > 0) // spawn towers until it reaches the max number of towers you can put in a game
    {
        [listTowers, numberTowers, tower_spawner] = T.spawn_tower(listTowers, tower_spawner, worldPath, numberTowers, height, width, path);
        tower_targets = T.concat_targets(listTowers, tower_targets);
    }
    [listMonsters, hearts] = M.monsterAtTheEnd(hearts, path, listMonsters);

    listMonsters = M.monsters_move(listMonsters, path, S.nil);
    listMonsters = M.fuseMonsters(listMonsters);
    worldVar = W.fillWorld(worldPath, listMonsters);

    //console.log(D.listDispActor(listMonsters));
    
    [listTowers, worldVar] = T.play_tower_turn2(worldVar, path, listTowers);
    listMonsters = W.worldRefreshMonsters(listMonsters, worldVar);
    listMonsters = M.despawnMonsters(listMonsters);
    //listMonsters = S.reverse(listMonsters);
    worldVar = W.fillWorld(worldPath, listMonsters);
    worldVar = W.fillWorld(worldVar, listTowers);

    turns += 1;
    console.log("Turn :", turns, "| Health :", hearts);
    let worldString = D.worldDisp(worldVar);
    worldString = W.addColor(path, tower_targets, worldString);
    console.log(worldString, "\n");
}

console.log("-------------------------------------------");
console.log("");
console.log("");
console.log("");
if(S.isEmpty(listMonsters)) {
    console.log("LE JOUEUR A GAGNE, TOUT LES MONSTRES SONT MORTS");
}

if(hearts <= 0) {
    console.log("LE JOUEUR A PERDU, LES MONSTRES ONT DETRUIT LE COEUR");
}

if(turns >= maxTurns) {
    console.log("LE NOMBRE DE TOUR MAXIMUM A ETE ATTEINT, LE JOUEUR A GAGNE");
}
 

console.log("");
console.log("");
console.log("");
console.log("-------------------------------------------");