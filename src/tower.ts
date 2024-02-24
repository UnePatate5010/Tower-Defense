import * as A from "./actors.js";
import * as C from "./characters.js";
import * as S from "./structures.js";
import * as W from "./world.js";
import * as M from './monster.js';
import {dispPos} from "./actors.js";

export const towerNames = ["", "", "Archery", "Canon"];

// Computes the norm of a position minus an other position
// x, y : coordinates of the first position
// x2, y2 : coordinates of the second position
export function norm(x: number, x2: number, y: number, y2: number): number
{
  return Math.sqrt((x - x2)*(x - x2) + (y - y2)*(y - y2));
}

// Computes the position of the path that can be reach by a tower.
// tower : the tower we compute positions of the path in its range
// path : list of positions of the path
// return a list of the positions reachable by the tower
export function calcul_target(tower: A.Actor, path: S.List<A.Position>): S.List<A.Position>
{
    if (S.isEmpty(path))
        return S.nil;
    const x: number = A.get_x(tower);
    const y: number = A.get_y(tower);
    const current = S.head(path);
    const x2: number = A.get_pos_x(current);
    const y2: number = A.get_pos_y(current);
    if (norm(x, x2, y, y2) <= A.get_range(tower)) {
        return S.cons(current, calcul_target(tower, S.tail(path)));
    }
    return calcul_target(tower, S.tail(path));
}

// Detects if a tower can attack and if there is a monster in its range
// tower : tower in question
// targets : list of position targettable by the tower
// world : the world (on which monsters are)
export function can_shoot(world: S.List<S.List<A.Actor>>, tower: A.Actor, targets: S.List<A.Position>): boolean
{
    if (S.isEmpty(targets) || (A.get_tick_speed(tower) < 100))
        return false;
    const x: number = A.get_pos_x(S.head(targets));
    const y: number = A.get_pos_y(S.head(targets));
    if (A.isMonster(A.get_id(W.worldGet(world, x, y)))) {
        return true;
    }
    return can_shoot(world, tower, S.tail(targets));
}


// Executes an attack of a tower on a monster
// tower : tower who can shoot a monster
// targets : list of position targettable by the tower
// world : the world (on which monsters are)
export function shoot_target(world: S.List<S.List<A.Actor>>, tower: A.Actor, targets: S.List<A.Position>): S.List<S.List<A.Actor>> {
    const x: number = A.get_pos_x(S.head(targets));
    const y: number = A.get_pos_y(S.head(targets));
    const current = W.worldGet(world, x, y);
    if (A.isMonster(A.get_id(current))) {
        const towerAttack = A.get_attack(tower);
        console.log(towerNames[A.get_id(tower)]+" at "+dispPos(A.get_position(tower))+" dealt "+towerAttack+" damage to "+M.monsterNames[A.get_id(current)]+" at "+dispPos(A.get_position(current))+".");
        return W.worldSet(world, x, y, A.set_health(current, A.get_health(current) - towerAttack));
    }
    return shoot_target(world, tower, S.tail(targets));
}

// Return a list of tower who can play and shoot a monster
// list_towers : list of all tower on the map
// world : the world (on which monsters are)
export function play_tower_speed(list_towers: S.List<A.Actor>, world: S.List<S.List<A.Actor>>): S.List<A.Actor> {
    if (S.isEmpty(list_towers)) {
        return S.nil;
    }
    const current = S.head(list_towers);
    const current_tickspeed = A.get_tick_speed(current);
    if ((current_tickspeed > 99) && can_shoot(world, current, A.get_target(current))) {
        return S.cons(A.set_tick_speed(current, current_tickspeed-100), play_tower_speed(S.tail(list_towers), world));
    }
    return play_tower_speed(S.tail(list_towers), world);
}

// Update the world with damage taken for monsters
// list_towers : list of tower who can shoot
// targets : target for the first tower
// path : list of positions of the path
// world : the world (on which monsters are)
export function play_tower_shoot(list_towers: S.List<A.Actor>, targets: S.List<A.Position>, path: S.List<A.Position>, world: S.List<S.List<A.Actor>>): S.List<S.List<A.Actor>>
{
  if (S.isEmpty(S.tail(list_towers))) { //What if list_towers only contains one element ?
    return world;
  }
  return play_tower_shoot(S.tail(list_towers), A.get_target(S.head(S.tail(list_towers))), path,
      shoot_target(world, S.head(list_towers), targets));
}

// Set the speed of all towers in the end of the tower turn
// list_towers : list of all tower
// world : the world (on which monsters are)
export function reset_tower_speed(list_towers: S.List<A.Actor>, world: S.List<S.List<A.Actor>>): S.List<A.Actor>
{
    if (S.isEmpty(list_towers)) {
        return S.nil;
    }
    const current = S.head(list_towers);
    const current_tick_speed = A.get_tick_speed(current);

    /*
    if (A.get_speed(current) + current_tick_speed >= 100) {
        if (can_shoot(world, current, A.get_target(current))) {
            return S.cons(
                A.set_tick_speed(current, A.get_speed(current) + current_tick_speed - 100),
                reset_tower_speed(S.tail(list_towers), world));
        }
        return S.cons(current, reset_tower_speed(S.tail(list_towers), world));
    }*/
    return S.cons(
        A.set_tick_speed(current, current_tick_speed + Number(current_tick_speed<100)*A.get_speed(current)),
        reset_tower_speed(S.tail(list_towers), world));
}


// Returns a random staring position that is at an extremity of the world.
// World : the world
// height, width : dimension of the world
// Return : an element of the world that will be a random starting position
export function getRandomTowerPos(world: S.List<S.List<A.Actor>>, height: number, width: number): A.Position {
    const x = W.getRandomInt(width);
    const y = W.getRandomInt(height);
    if (A.get_id(W.worldGet(world, x, y)) === A.Actortype.field)
        return {x : x, y : y};
    return getRandomTowerPos(world, height, width);
}

export function spawn_tower(towers: S.List<A.Actor>, spawner: A.Actor, world: S.List<S.List<A.Actor>>, maxSpawns: number, height: number, width: number, path: S.List<A.Position>): [ S.List<A.Actor>, number, A.Actor ] {
    const current_tickspeed = A.get_tick_speed(spawner);
    const spawner_speed = A.get_speed(spawner);
    if (current_tickspeed + spawner_speed > 99) {
        maxSpawns -= 1;
        // const rates = [4, 7, 9, 10, 100];
        const spawned_type = W.getRandomInt(2);

        const tower_characters = [ C.tower1Actor, C.tower2Actor ];

        let spawned = A.set_position(tower_characters[spawned_type], getRandomTowerPos(world, height, width));
        spawned = A.set_target(spawned, calcul_target(spawned, path));
        towers = S.cons(spawned, towers);
        spawner = A.set_tick_speed(spawner, current_tickspeed + spawner_speed - 100);
    } else {
        spawner = A.set_tick_speed(spawner, current_tickspeed + spawner_speed);
    }
    return [ towers, maxSpawns, spawner ];
}

export function concat_targets(list_towers: S.List<A.Actor>, got_targets:S.List<A.Position>=S.nil):S.List<A.Position>
{
    if (S.isEmpty(list_towers))
        return got_targets;
    got_targets = S.listMergeUniq(got_targets, A.get_target(S.head(list_towers)), A.PosIsPos);
    return concat_targets(S.tail(list_towers), got_targets);
}

// Play towers turn
// list_towers : list of all tower
// path : list of positions of the path
// world : the world (on which monsters are)
export function play_tower_turn(world: S.List<S.List<A.Actor>>, path: S.List<A.Position>, list_towers: S.List<A.Actor>): [S.List<A.Actor>, S.List<S.List<A.Actor>>] 
{
    const active_tower: S.List<A.Actor> = play_tower_speed(list_towers, world);
    
    if (S.isEmpty(active_tower))
    {
        list_towers = reset_tower_speed(list_towers, world);
        return [list_towers, world];
    }
    const new_world: S.List<S.List<A.Actor>> =
        play_tower_shoot(active_tower, calcul_target(S.head(active_tower), path), path, world);
    const new_towers: S.List<A.Actor> = reset_tower_speed(list_towers, world);
    return [new_towers, new_world];
}

export function play_tower_turn2(world: S.List<S.List<A.Actor>>, path: S.List<A.Position>, list_towers: S.List<A.Actor>, refreshed_towers: S.List<A.Actor> = S.nil): [S.List<A.Actor>, S.List<S.List<A.Actor>>]
{
    if (S.isEmpty(list_towers))
        return [refreshed_towers, world];
    let current = S.head(list_towers);
    let current_tickspeed = A.get_tick_speed(current);
    if (current_tickspeed<100)
    {
        current_tickspeed += A.get_speed(current);
        current = A.set_tick_speed(current, current_tickspeed);
    }
    const current_targets = A.get_target(current);
    if (can_shoot(world, current, current_targets))
    {
        world = shoot_target(world, current, current_targets);
        current = A.set_tick_speed(current, current_tickspeed-100);
    }
    return play_tower_turn2(world, path, S.tail(list_towers), S.cons(current, refreshed_towers));
}
