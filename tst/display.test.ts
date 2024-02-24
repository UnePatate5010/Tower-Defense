import * as D from "../src/display";
import * as S from "../src/structures";
import * as A from "../src/actors";


describe("display test", () => {

    test("listDispActor(cons(a, cons (a, nil)) == [1,1]", () => {
        const actortest: A.Actor = {
            id: A.Actortype.tower,
            position: A.createPos(5, 4),
            attack: 50,
            tickspeed: 12,
            health: 60,
            speed: 20,
            range: 15,
            target: S.nil
        };
        const list = D.listDispActor(S.cons(actortest, S.cons(actortest, S.nil)));
        expect(list).toBe("[" + D.str[A.get_id(actortest)] + "," + D.str[A.get_id(actortest)] + "]");
    });

    test("listDispActor(nil) == []", () => { expect(D.listDispActor(S.nil)).toBe("[]"); });

    test("listMap(nil) == []", () => { expect(S.listMap((x: number) => x, S.nil)).toBe(S.nil); });


    test("worldDisp(cons(cons(a, cons(a, nil)), cons(cons(a, cons(a, nil)), nil))) == [[♜,♜], [♜,♜]]",
        () => {
            const a: A.Actor = {
                id: A.Actortype.tower,
                position: A.createPos(5, 4),
                attack: 50,
                tickspeed: 12,
                health: 60,
                speed: 20,
                range: 15,
                target: S.nil
            };
            const world = S.cons(S.cons(a, S.cons(a, S.nil)), S.cons(S.cons(a, S.cons(a, S.nil)), S.nil));
            expect(D.worldDisp(world)).toBe("[" + D.str[A.get_id(a)] + "," + D.str[A.get_id(a)] + "]\n[" + D.str[A.get_id(a)] + "," + D.str[A.get_id(a)] + "]\n");
        });

});
