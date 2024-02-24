import * as M from "../src/monster.js";
import * as S from "../src/structures.js";
import * as A from "../src/actors.js";
import * as C from "../src/characters.js";

describe('Monster test', () => {





    test("MonsterAtTheEnd test", () => {
        const pos1 = A.createPos(0, 0);
        const pos2 = A.createPos(0, 1);
        const path = S.cons(pos1, S.cons(pos2, S.nil));

        const monst = A.createActor(A.Actortype.mudman, pos2, 2, 2, 5, 5, 5, S.nil);
        const monsters = S.cons(monst, S.nil);

        expect(M.monsterAtTheEnd(10, path, monsters)).toStrictEqual([S.nil, 8]);
    });

});
