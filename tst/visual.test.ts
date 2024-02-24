import * as W from "../src/world.js";
import * as A from "../src/actors.js";
import * as D from "../src/display.js";

describe("visual test", () => { 
    test("visual", () => {expect(W.listDispPosition(W.createPath({x:0, y:0}, {x:3, y:4}, 5, 5)));});

    test("test display path", () => {
        let world = W.initializeWorld(5, 5, 5);
        const startPoint = W.getRandomStartPoint(world, 5, 5);
        const endPoint = W.getRandomEndPoint(world, 5, 5, startPoint);
        const path= W.createPath(A.get_position(startPoint),A.get_position(endPoint),5,5);
        world = W.copy_path_into_world(path, world);
        console.log(D.worldDisp(world));
    });

    test("test display path", () => {
        let world = W.initializeWorld(10, 10, 10);
        const startPoint = W.getRandomStartPoint(world, 10, 10);
        const endPoint = W.getRandomEndPoint(world, 10, 10, startPoint);
        const path= W.createPath(A.get_position(startPoint),A.get_position(endPoint),10,10);
        world = W.copy_path_into_world(path, world);
        console.log(D.worldDisp(world));
        W.listDispPosition(path);
    });

    test("test display path more complex", () => {
        let world = W.initializeWorld(15, 15, 15);
        const startPoint = W.getRandomStartPoint(world, 15, 15);
        const endPoint = W.getRandomEndPoint(world, 15, 15, startPoint);
        const path= W.createPath_1(A.get_position(startPoint),A.get_position(endPoint),15,15);
        world = W.copy_path_into_world(path, world);
        console.log(D.worldDisp(world));
    });

    /*
    test("test display path more complex 2", () => {
        let world = W.initializeWorld(15, 15, 15);
        const startPoint = W.getRandomStartPoint(world, 15, 15);
        const endPoint = W.getRandomEndPoint(world, 15, 15, startPoint);
        const path= W.createPath_2(A.get_position(startPoint),A.get_position(endPoint),15,15);
        world = W.copy_path_into_world(path, world);
        console.log(D.worldDisp(world));
    });
    */
   
    test("test display path more complex N", () => {
        let world = W.initializeWorld(20, 20, 20);
        const startPoint = W.getRandomStartPoint(world, 20, 20);
        const endPoint = W.getRandomEndPoint(world, 20, 20, startPoint);
        const path= W.createPath_N(A.get_position(startPoint),A.get_position(endPoint),20,20, 6);
        W.listDispPosition(path);
        world = W.copy_path_into_world(path, world);
        console.log(D.worldDisp(world));
    });
});