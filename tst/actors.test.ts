import * as A from '../src/actors.js';
import * as S from '../src/structures.js';
import { lstat } from 'fs/promises';


const pos = A.createPos(4, 5);

const actor = A.createActor(
    A.Actortype.tower,
    pos,
    50,
    15,
    60,
    20,
    15,
    S.cons(A.createPos(1, 3), S.cons(A.createPos(4,5), S.nil))
  );


  describe('createActor test', () => {


    test("get_attack", () => {expect(A.get_attack(actor)).toBe(50);});
    test("get_id", () => {expect(A.get_id(actor)).toBe(A.Actortype.tower);});
    test("get_position", () => {expect(A.get_position(actor)).toStrictEqual(A.createPos(4, 5));});
    test("get_tickspeed", () => {expect(A.get_tick_speed(actor)).toBe(15);});
    test("get_health", () => {expect(A.get_health(actor)).toBe(60);});
    test("get_speed", () => {expect(A.get_speed(actor)).toBe(20);});
    test("get_target", () => {expect(A.get_target(actor)).toStrictEqual(S.cons(A.createPos(1, 3), S.cons(A.createPos(4,5), S.nil)));});
    test("get_range", () => {expect(A.get_range(actor)).toBe(15);});

    const actor2 = A.set_id(actor, A.Actortype.mudman);
    test("set_id", () => {expect(A.get_id(actor2)).toBe(A.Actortype.mudman);});
    test("set_id_get_attack", () => {expect(A.get_attack(actor)).toBe(50);});
    test("set_id_get_position", () => {expect(A.get_position(actor2)).toStrictEqual(A.createPos(4, 5));});
    test("set_id_get_health", () => {expect(A.get_health(actor2)).toBe(60);});
    test("set_id_get_speed", () => {expect(A.get_speed(actor2)).toBe(20);});
    test("set_id_get_range", () => {expect(A.get_range(actor2)).toBe(15);});

    test("get_x", () => {expect(A.get_x(actor)).toBe(4);});
    test("get_y", () => {expect(A.get_y(actor)).toBe(5);});
    test("get_pos_x", () => {expect(A.get_pos_x(actor.position)).toBe(4);});
    test("get_pos_y", () => {expect(A.get_pos_y(actor.position)).toBe(5);});

    const pos2 = A.createPos(2, 1);
    const actor3 = A.set_position(actor, pos2);
    test("set_position", () => {expect(A.get_position(actor3)).toStrictEqual(A.createPos(2, 1));});

    const actor4 = A.set_attack(actor, 20);
    test("set_attack", () => {expect(A.get_attack(actor4)).toBe(20);});

    const actor6 = A.set_health(actor, 30);
    test("set_health", () => {expect(A.get_health(actor6)).toBe(30);});

    const actor7 = A.set_speed(actor, 4);
    test("set_speed", () => {expect(A.get_speed(actor7)).toBe(4);});

    const actor8 = A.set_range(actor, 75);
    test("set_range", () => {expect(A.get_range(actor8)).toBe(75);});

    const actor9 = A.set_tick_speed(actor, 8);
    test("set_tick_speed", () => {expect(A.get_tick_speed(actor9)).toBe(8);});
    test("bool_tick_speed: false", () => {expect(A.bool_tick_speed(actor9)).toBe(false);});

    const actor10 = A.set_tick_speed(actor, 119);
    test("bool_tick_speed: true", () => {expect(A.bool_tick_speed(actor10)).toBe(true);});

    const actor11 = A.set_target(actor, S.cons(A.createPos(8, 7), S.cons(A.createPos(9, 4), S.nil)));
    test("set_target", () => {expect(A.get_target(actor11)).toStrictEqual(S.cons(A.createPos(8, 7), S.cons(A.createPos(9, 4), S.nil)));});

    test("PosIsPos", () => { 
      const a = A.createPos(5,5);
      const b = A.createPos(5,5);
      const c = A.createPos(5, 0);
      expect(A.PosIsPos(a, b)).toStrictEqual(true);
      expect(A.PosIsPos(a, c)).toStrictEqual(false);
    });
  });
