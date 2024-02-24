import * as W from "../src/world";
import * as S from "../src/structures";
import * as A from "../src/actors";

describe("World tests", () => { 


	test('initializeLine actually create line with field', () => {
		expect( () => {W.initializeLine(4, -2, 3); }).toThrow(Error);
		expect( () => {W.initializeLine(8, 6, -41); }).toThrow(Error);
		expect( () => {W.initializeLine(-1, 12, 42); }).toThrow(Error);
		expect(W.initializeLine(0, 0, 0)).toBe(S.nil);


	});

	test('initializeWorld actually create world with field', () => {
		expect( () => {W.initializeWorld(4, -2, 3); }).toThrow(Error);
		expect( () => {W.initializeWorld(8, 6, -41); }).toThrow(Error);
		expect( () => {W.initializeWorld(-1, 12, 42); }).toThrow(Error);
	});

    test('listGet actually reads lists correctly', () => { 
	const line1 = S.cons(1, S.cons(2, S.cons(3, S.nil)));         // [1,2,3]
	const line3 = S.cons(7, S.cons(8, S.cons(9, S.nil)));         // [7,8,9]
	const emptyList = S.nil;
	expect(S.listGet(line1, 0)).toBe(1);
	expect(S.listGet(line1, 1)).toBe(2);
	expect(S.listGet(line3, 0)).toBe(7);
	expect( () => {S.listGet(emptyList, 3); }).toThrow(Error);
	expect( () => {S.listGet(emptyList, 4); }).toThrow(Error);
    });
    test('listSet actually changes lists correctly', () => { 
	const line1 = S.cons(1, S.cons(2, S.cons(3, S.nil)));         // [1,2,3]
	const emptyList = S.nil;
	expect( () => {S.listSet(line1, 3, 456); }).toThrow(Error);
	const line2 = S.listSet(line1, 0, 777);
	expect(S.listGet(line2, 0)).toBe(777);
	expect(S.listGet(line2, 1)).toBe(2);
	expect(S.listGet(line2, 2)).toBe(3);
	expect( () => {S.listSet(emptyList, 3, 456); }).toThrow(Error);
	expect( () => {S.listSet(emptyList, 4, 456); }).toThrow(Error);
	expect( () => {S.listSet(emptyList, -1, 456); }).toThrow(Error);
    });

    test('worldGet actually reads worlds correctly', () => { 
	const line1 = S.cons(1, S.cons(2, S.cons(3, S.nil)));         // [[1,2,3],
	const line2 = S.cons(4, S.cons(5, S.cons(6, S.nil)));         //  [4,5,6],
	const line3 = S.cons(7, S.cons(8, S.cons(9, S.nil)));         //  [7,8,9]]
	const aMatrix = S.cons(line1, S.cons(line2, S.cons(line3, S.nil)));
	expect(W.worldGet(aMatrix, 0, 0)).toBe(1);
	expect(W.worldGet(aMatrix, 0, 1)).toBe(2);
	expect(W.worldGet(aMatrix, 2, 0)).toBe(7);
	expect( () => {W.worldGet(aMatrix, 4, 3); }).toThrow(Error);
	expect( () => {W.worldGet(aMatrix, 3, 3); }).toThrow(Error);
	expect( () => {W.worldGet(aMatrix, 2, -1); }).toThrow(Error);
    });    
    test('worldSet actually changes worlds correctly', () => {
	const line1 = S.cons(1, S.cons(2, S.cons(3, S.nil)));         // [[1,2,3],
	const line2 = S.cons(4, S.cons(5, S.cons(6, S.nil)));         //  [4,5,6],
	const line3 = S.cons(7, S.cons(8, S.cons(9, S.nil)));         //  [7,8,9]]
	const empty = S.nil;
	const aMatrix = S.cons(line1, S.cons(line2, S.cons(line3, S.nil)));
	const aMatrix2 = W.worldSet(aMatrix, 0, 0, 777);
	const aMatrix3 = S.cons(line2, S.cons(line3, S.nil));
	expect(W.worldGet(aMatrix2, 0, 0)).toBe(777);
	expect(W.worldGet(aMatrix2, 0, 1)).toBe(2);
	expect(W.worldGet(aMatrix2, 2, 0)).toBe(7);
	expect(W.worldGet(aMatrix2, 2, 2)).toBe(9);
	expect( () => {W.worldGet(aMatrix2, 3, 3); }).toThrow(Error);
	expect( () => {W.worldGet(aMatrix2, 3, 2); }).toThrow(Error);
	expect( () => {W.worldGet(aMatrix2, 2, 3); }).toThrow(Error);
	expect(W.worldGet(W.worldSet(aMatrix2, 2, 1, -1), 2, 1)).toBe(-1);
	expect(W.worldGet(W.worldSet(aMatrix2, 2, 0, 99), 2, 0)).toBe(99);
	expect(W.worldGet(W.worldSet(aMatrix2, 2, 2, 999), 2, 2)).toBe(999);
	expect(W.worldGet(W.worldSet(aMatrix3, 1, 2, 999), 1, 2)).toBe(999);
	expect( () => {W.worldSet(empty, 0, 0, 0); }).toThrow(Error);
	expect( () => {W.worldSet(empty, 5, 5, 4567); }).toThrow(Error);
	expect( () => {W.worldSet(aMatrix2, 4, 3, 0); }).toThrow(Error);
	expect( () => {W.worldSet(aMatrix2, 4, 2, 0); }).toThrow(Error);
	expect( () => {W.worldSet(aMatrix2, 2, 3, 0); }).toThrow(Error);
	expect( () => {W.worldSet(aMatrix2, 2, -1, 0); }).toThrow(Error);
	expect( () => {W.worldSet(aMatrix3, 2, 2, 0); }).toThrow(Error);
    });


	test("copy_path_into_world test", () => {
		let world = W.initializeWorld(2, 2, 2);
		const p1 = A.createPos(0, 0);
		const p2 = A.createPos(0, 1);
		const p3 = A.createPos(1, 1);
		const path = S.cons(p1, S.cons(p2, S.cons(p3, S.nil)));
		world = W.copy_path_into_world(path, world);
		expect(A.get_id(W.worldGet(world, 0, 0))).toStrictEqual(A.Actortype.path);
		expect(A.get_id(W.worldGet(world, 0, 1))).toStrictEqual(A.Actortype.path);
		expect(A.get_id(W.worldGet(world, 1, 1))).toStrictEqual(A.Actortype.path);
	});
});


//test('aMatrix(0,0) = 1', () => { expect(worldGet(aMatrix, 0, 0)).toBe(1); });
//test('aMatrix(0,0) = 2', () => { expect(worldGet(aMatrix, 0, 0)).toBe(2); });




