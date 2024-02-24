import * as S from "../src/structures.js";
import * as A from "../src/actors.js";
import * as W from "../src/world.js";


describe("structures test", () => {

    test("isIn([1,2,3], 2) == True", () => { expect(S.isIn(S.cons(1, S.cons(2, S.cons(3, S.nil))), 2)).toStrictEqual(true); });
    test("isIn([1,2,3], 0) == false", () => { expect(S.isIn(S.cons(1, S.cons(2, S.cons(3, S.nil))), 0)).toStrictEqual(false); });
    test("isIn positions lists", () => { 
        const a1 = A.createPos(0, 1);
        const a2 = A.createPos(1, 1);
        const a3 = A.createPos(1, 2);
        const a4 = A.createPos(1, 3);
        const a5 = A.createPos(1, 4);
        const a = S.cons(a1, S.cons(a2, S.cons(a3, S.cons(a4, S.cons(a5, S.nil)))));
        expect(S.isIn(a, A.createPos(1, 2), A.PosIsPos)).toStrictEqual(true);
        expect(S.isIn(a, A.createPos(5, 2), A.PosIsPos)).toStrictEqual(false);
    });


    test("addNTimes(nil, 5, 3) == [5, 5, 5]", () => { expect(S.addNTimes(S.nil, 5, 3)).toStrictEqual(S.cons(5, S.cons(5, S.cons(5, S.nil)))); });

    test("listMerge([1,2], [3]) == [2,1,3]]", () => { expect(S.listMerge(S.cons(1, S.cons(2, S.nil)), S.cons(3, S.nil))).toStrictEqual(S.cons(2, S.cons(1, S.cons(3, S.nil)))); });

    test("removeElement([1,2,3,4], 1) == [1, 3, 4]", () => { expect(S.removeElement(S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.nil)))), 1)).toStrictEqual(S.cons(1, S.cons(3, S.cons(4, S.nil)))); });

    test("superMerge", () => {
        const a = S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.nil))));
        const b = S.cons(4, S.cons(3, S.cons(5, S.cons(6, S.nil))));
        expect(S.SuperMerge(a, b)).toStrictEqual(S.cons(1, S.cons(2, S.cons(3, S.cons(5, S.cons(6, S.nil))))));
        const c = S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.nil))));
        const d = S.cons(4, S.cons(5, S.cons(6, S.cons(7, S.nil))));
        expect(S.SuperMerge(c, d)).toStrictEqual(S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.cons(5, S.cons(6, S.cons(7, S.nil))))))));
        const e = S.cons(1, S.cons(2, S.cons(3, S.cons(5, S.nil))));
        const f = S.cons(4, S.cons(3, S.cons(5, S.cons(6, S.nil))));
        const g = S.cons(6, S.cons(5, S.cons(3, S.cons(8, S.nil))));
        expect(S.SuperMerge(S.SuperMerge(e, f), g)).toStrictEqual(S.cons(1, S.cons(2, S.cons(3, S.cons(8, S.nil)))));
    });

    test("superMerge with positions lists", () => {    
        const a1 = A.createPos(0, 1);
        const a2 = A.createPos(1, 1);
        const a3 = A.createPos(1, 2);
        const a4 = A.createPos(1, 3);
        const a5 = A.createPos(1, 4);
        const b1 = A.createPos(1, 4);
        const b2 = A.createPos(1, 3);
        const b3 = A.createPos(1, 2);
        const b4 = A.createPos(2, 2);
        const b5 = A.createPos(3, 2);
        const a = S.cons(a1, S.cons(a2, S.cons(a3, S.cons(a4, S.cons(a5, S.nil)))));
        const b = S.cons(b1, S.cons(b2, S.cons(b3, S.cons(b4, S.cons(b5, S.nil)))));
        const c = S.cons(a1, S.cons(a2, S.cons(a3, S.cons(b4, S.cons(b5, S.nil)))));
        expect(S.SuperMerge(a, b, A.PosIsPos)).toStrictEqual(c);
        });


    test("remove", () => {    
        const a = S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.cons(5, S.cons(6, S.cons(7, S.nil)))))));
        expect(S.removeAfterElement(a, 4)).toStrictEqual(S.cons(1, S.cons(2, S.cons(3, S.cons(4, S.nil)))));
        expect(S.removeBeforeElement(a, 4)).toStrictEqual(S.cons(5, S.cons(6, S.cons(7, S.nil))));

    });

    test("remove element after and before positions list", () => {    
        const a1 = A.createPos(0, 1);
        const a2 = A.createPos(1, 1);
        const a3 = A.createPos(1, 2);
        const a4 = A.createPos(1, 3);
        const a5 = A.createPos(1, 4);
        const a = S.cons(a1, S.cons(a2, S.cons(a3, S.cons(a4, S.cons(a5, S.nil)))));
        const b = S.cons(a1, S.cons(a2, S.cons(a3, S.nil)));
        const c = S.cons(a4, S.cons(a5, S.nil));
        console.log("test");
        expect(S.removeAfterElement(a, a3, A.PosIsPos)).toStrictEqual(b);
        expect(S.removeBeforeElement(a, a3, A.PosIsPos)).toStrictEqual(c);
    });

    test("supermerge aux function", () => {    
        const a1 = A.createPos(0, 1);
        const a2 = A.createPos(1, 1);
        const a3 = A.createPos(1, 2);
        const a4 = A.createPos(1, 3);
        const a5 = A.createPos(1, 4);
        const b1 = A.createPos(1, 4);
        const b2 = A.createPos(1, 3);
        const b3 = A.createPos(1, 2);
        const b4 = A.createPos(2, 2);
        const b5 = A.createPos(3, 2);
        const a = S.cons(a1, S.cons(a2, S.cons(a3, S.cons(a4, S.cons(a5, S.nil)))));
        const b = S.cons(b1, S.cons(b2, S.cons(b3, S.cons(b4, S.cons(b5, S.nil)))));
        expect(S.aux_test(a, b, A.PosIsPos)).toStrictEqual(a3);
    });
});