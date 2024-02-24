import * as S from './structures.js';

// Enumeration that lists the types of characters that could be in the world.
export enum Actortype {
  mudman,
  sus,
  tower,
  annihilator,
  field,
  path
}

// A structure that representes all actors in the game, some fields are set to -1 if it makes no
// sence for that types of actor. EX : path speed has no meaning so speed of a path actor will be
// -1.
export type Actor = {
    id: Actortype; position : Position; attack : number; tickspeed : number;
    health : number;
    speed : number;
    range : number;
    target : S.List<Position>;
};

// A new types that stores positions.
export type Position = {
    x: number; y : number;
};

// A function that creates actors according to the inputs.
export function createActor(
    id: Actortype, position: Position, attack: number, tickspeed: number,
    health: number, speed: number, range: number, target: S.List<Position>): Actor {

    return {
        id: id,
        position: position,
        attack: attack,
        tickspeed: tickspeed,
        health: health,
        speed: speed,
        range: range,
        target: target
    };
}

// A function that creates an position with the position type of variable.
export function createPos(x: number, y: number): Position {
    return {x: x, y: y};
}

export function dispPos(pos: Position): string
{
    return pos["x"]+", "+pos["y"];
}

// Tests if two positions are the same.
export function PosIsPos(pos1: Position, pos2: Position) {
    return ((get_pos_x(pos1) === get_pos_x(pos2)) && (get_pos_y(pos1) === get_pos_y(pos2)));
}

export function get_id(actor: Actor): Actortype { return actor.id; }

export function set_id(actor: Actor, new_id: Actortype): Actor {
    return {
        id: new_id,
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: get_speed(actor),
        range: get_range(actor),
        target: get_target(actor)
    };
}

export function get_position(actor: Actor): Position { return actor.position; }

export function get_x(actor: Actor): number { return get_position(actor).x; }

export function get_y(actor: Actor): number { return get_position(actor).y; }

export function get_xy(actor: Actor):[number, number] { return [get_x(actor), get_y(actor)];}

export function get_pos_x(pos: Position): number { return pos.x; }

export function get_pos_y(pos: Position): number { return pos.y; }

export function set_position(actor: Actor, new_position: Position): Actor {
    return {
        id: get_id(actor),
        position: new_position,
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: get_speed(actor),
        range: get_range(actor),
        target: get_target(actor)
    };
}

export function get_attack(actor: Actor): number { return actor.attack; }

export function set_attack(actor: Actor, new_attack: number): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: new_attack,
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: get_speed(actor),
        range: get_range(actor),
        target: get_target(actor)
    };
}


// Tick speed is a speed after wich a move is applied (this is used to slow monsters down). Each
// turn the field speed is added to tickspeed and when it reaches a threshold values we make the
// move and take away from tickspeed that threshold.

export function get_tick_speed(actor: Actor): number { return actor.tickspeed; }

export function set_tick_speed(actor: Actor, new_tickspeed: number): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: new_tickspeed,
        health: get_health(actor),
        speed: get_speed(actor),
        range: get_range(actor),
        target: get_target(actor)
    };
}

// Function that decides wheither to make the move or not.
export function bool_tick_speed(actor: Actor): boolean {
    return get_tick_speed(actor) > 99;
}

export function get_health(actor: Actor): number { return actor.health; }

export function set_health(actor: Actor, new_health: number): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: new_health,
        speed: get_speed(actor),
        range: get_range(actor),
        target: get_target(actor)
    };
}
export function get_speed(actor: Actor): number { return actor.speed; }

export function set_speed(actor: Actor, new_speed: number): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: new_speed,
        range: get_range(actor),
        target: get_target(actor)
    };
}
export function get_range(actor: Actor): number { return actor.range; }
export function set_range(actor: Actor, new_range: number): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: get_speed(actor),
        range: new_range,
        target: get_target(actor)
    };
}

export function get_target(actor: Actor): S.List<Position> { return actor.target; }

export function set_target(actor: Actor, new_target: S.List<Position>): Actor {
    return {
        id: get_id(actor),
        position: get_position(actor),
        attack: get_attack(actor),
        tickspeed: get_tick_speed(actor),
        health: get_health(actor),
        speed: get_speed(actor),
        range: get_range(actor),
        target: new_target
    };
}

export function isMonster(id: Actortype)
{
    return ((id === Actortype.mudman) || (id === Actortype.sus));
}
