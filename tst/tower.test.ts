import * as T from '../src/tower.js';
import * as A from '../src/actors.js';
import * as S from '../src/structures.js';
import * as C from '../src/characters.js';
import * as W from '../src/world.js';

const pos = A.createPos(4, 5);

const actor = A.createActor(
  A.Actortype.tower,
  pos,
  50,
  15,
  60,
  20,
  3,
  S.nil
);

describe('Tower test', () => {
  const path: S.List<A.Position> = S.cons(A.createPos(5, 5), S.cons(A.createPos(6, 3), S.cons(A.createPos(12, 9), S.nil)));
  test("Norm", () => { expect(T.norm(7, 8, 2, 4)).toBe(Math.sqrt(5)); });
  test("Calcul_target", () => { expect(T.calcul_target(actor, path)).toStrictEqual(S.cons(A.createPos(5, 5), S.cons(A.createPos(6, 3), S.nil))); });
  const path2: S.List<A.Position> = S.cons(A.createPos(5, 5), S.cons(A.createPos(6, 3), S.cons(A.createPos(12, 9), S.cons(A.createPos(5, 6), S.nil))));
  test("Calcul_target", () => { expect(T.calcul_target(actor, path2)).toStrictEqual(S.cons(A.createPos(5, 5), S.cons(A.createPos(6, 3), S.cons(A.createPos(5, 6), S.nil)))); });


  test("shoot_target_bool", () => {
    let tower = C.tower2Actor;
    tower = A.set_tick_speed(tower, 150);

    let world = W.initializeWorld(5, 5, 5);
    const mob = C.mudmanActor;
    world = W.worldSet(world, 2, 3, mob);

    const target_list = S.cons(A.createPos(2,2), S.cons(A.createPos(2,3), S.nil));
    const target_list1 = S.cons(A.createPos(2,2), S.cons(A.createPos(2,1), S.nil));
    expect(T.can_shoot(world, tower, target_list)).toStrictEqual(true);
    expect(T.can_shoot(world, tower, target_list1)).toStrictEqual(false);
    
    tower = A.set_tick_speed(tower, 5);
    expect(T.can_shoot(world, tower, target_list)).toStrictEqual(false);
  });



});

