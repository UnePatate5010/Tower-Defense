import * as A from "./actors.js";
import * as S from "./structures.js";
import * as W from "./world.js";
import * as C from "./characters.js";

export const monsterNames = ["Mudman", "Sus"];

//Make every monsters play.
export function monsters_move(monsters: S.List<A.Actor>, path:S.List<A.Position>, refreshed_monsters: S.List<A.Actor> = S.nil): S.List<A.Actor>
{
    if (S.isEmpty(monsters))
        return refreshed_monsters;
    let current_monster = S.head(monsters);
    current_monster = A.set_tick_speed(current_monster, A.get_tick_speed(current_monster)+A.get_speed(current_monster)); //Updates the speed.

    //Returns the next position in the path if it exists.
    //Returns the first position if the given position is not in the path.
    //Returns the last position if the given position is the last.
    function next_path_pos(remaining_path: S.List<A.Position>, current_pos: A.Position, first_pos: A.Position = A.createPos(-1, -1)): A.Position
    {
        if (A.PosIsPos(A.createPos(-1, -1), first_pos))
            first_pos = S.head(remaining_path);
        if (S.isEmpty(remaining_path))
            return first_pos;
        if (!A.PosIsPos(current_pos, S.head(remaining_path)))
            return next_path_pos(S.tail(remaining_path), current_pos, first_pos);
        if (S.isEmpty(S.tail(remaining_path))) // If there is no next position.
            return current_pos;
        return S.head(S.tail(remaining_path));
    }

    const current_tickspeed = A.get_tick_speed(current_monster);
    if (current_tickspeed>99)
    {
        const current_pos = A.get_position(S.head(monsters));
        const next_pos = next_path_pos(path, current_pos);
        current_monster = A.set_position(current_monster, next_pos); //Updates the position.
        current_monster = A.set_tick_speed(current_monster, current_tickspeed-100); //Updates the tickspeed.
    }
    return monsters_move(S.tail(monsters), path, S.cons(current_monster, refreshed_monsters));
}



//Adds a random monster if the spawner actor's tickspeed reaches 100. Reverses the list of monsters (use the W.worldRefreshMonsters function after the towers attacked to get the list in the right order).
//monsters: the list of monsters currently on the map
//spawner: the spawner actor
//path: the list containing the path
//mawspawns: the maximum number of monsters to spawn
export function spawn(monsters: S.List<A.Actor>, spawner: A.Actor, path:S.List<A.Position>, maxSpawns: number): [S.List<A.Actor>, number, A.Actor]
{
    const current_tickspeed = A.get_tick_speed(spawner);
    const spawner_speed = A.get_speed(spawner);
    if (current_tickspeed+spawner_speed>99)
    {
        maxSpawns -= 1;
        //const rates = [4, 7, 9, 10, 100];
        const spawned_type = W.getRandomInt(2);

        const monster_characters = [C.mudmanActor,C.susActor];

        const spawned = A.createActor(A.get_id(monster_characters[spawned_type]), S.head(path), A.get_attack(monster_characters[spawned_type]), 0, A.get_health(monster_characters[spawned_type]), A.get_speed(monster_characters[spawned_type]), 0, S.nil);
        monsters = S.cons(spawned, monsters);
        spawner = A.set_tick_speed(spawner, current_tickspeed+spawner_speed-100);
    }
    else{
        spawner = A.set_tick_speed(spawner, current_tickspeed+spawner_speed);
    }
    
    return [monsters, maxSpawns, spawner];
}





//Detects if a monster reached the end of the path and if yes, deals his damage to the player health.
//player_health : player_health
//path : list of the position of the path
//monsters : list of monsters currently on board
//return [monsters, player_health]
export function monsterAtTheEnd(player_health : number, path : S.List<A.Position>, monsters : S.List<A.Actor>) : [S.List<A.Actor>, number]
{
    const length_monsters : number = S.length(monsters);
    const last_monster : A.Actor = S.listGet(monsters, length_monsters - 1);
    const position_last_monster : A.Position = A.get_position(last_monster);

    const last_position : A.Position = S.listGet(path, S.length(path) - 1);

    if (A.PosIsPos(position_last_monster, last_position))
    {
        return [S.removeElement(monsters, length_monsters-1), player_health - A.get_attack(last_monster)];
    }
    else
    {
        return [monsters, player_health];
    }
}

//Fuse monsters if they are at the same position.
export function fuseMonsters(monsters: S.List<A.Actor>, refreshed_monsters: S.List<A.Actor> = S.nil): S.List<A.Actor>
{
    if (S.isEmpty(monsters)) //Terminal case.
        return refreshed_monsters;
    if (S.isEmpty(refreshed_monsters)) //To allow the function to compare the head of refreshed monsters with the head of monsters.
        return fuseMonsters(S.tail(monsters), S.cons(S.head(monsters), refreshed_monsters));
    const refreshed = S.head(refreshed_monsters);
    const current = S.head(monsters);
    const currentPos = A.get_position(current);
    if (A.PosIsPos(A.get_position(refreshed), currentPos))
    {
        const new_id = A.get_id(refreshed);
        const new_attack = (A.get_attack(refreshed) + A.get_attack(current))*0.75;

        const new_tickspeed = (A.get_tick_speed(refreshed) + A.get_tick_speed(current))*0.75;
        const new_health = (A.get_health(refreshed) + A.get_health(current))*0.75;
        const new_speed = (A.get_speed(refreshed) + A.get_speed(current))*0.75;
        const new_range = A.get_range(refreshed);
        const new_target = A.get_target(refreshed);

        const new_monster = A.createActor(new_id, currentPos, new_attack, new_tickspeed, new_health, new_speed, new_range, new_target);


        monsters = S.cons(new_monster, S.tail(monsters));
        refreshed_monsters = S.tail(refreshed_monsters);
        console.log("A "+monsterNames[A.get_id(current)]+" and a "+monsterNames[A.get_id(refreshed)]+" fused on "+A.dispPos(currentPos)+".\n");
    }
    return fuseMonsters(S.tail(monsters), S.cons(S.head(monsters), refreshed_monsters));
}

//Despawn monsters if they are clean.
export function despawnMonsters(monsters: S.List<A.Actor>, refreshed_monsters: S.List<A.Actor> = S.nil): S.List<A.Actor>
{
    if (S.isEmpty(monsters)) //Terminal case.
        return refreshed_monsters;
    const current = S.head(monsters);
    const currentPos = A.get_position(current);
    const currentHealth = A.get_health(current);
    console.log(monsterNames[A.get_id(current)]+" at "+A.dispPos(currentPos)+" has "+currentHealth+" health"+ ((currentHealth>0) ? ".": " and got purified."));
    if (A.get_health(current)<=0)
        return despawnMonsters(S.tail(monsters), refreshed_monsters);
    return despawnMonsters(S.tail(monsters), S.cons(current, refreshed_monsters));
}
