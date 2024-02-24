import * as A from './actors.js';
import * as C from "./characters.js";
import * as S from './structures.js';

// This function creates all the elements on the line n with a length of m
// width : a variable equal to m and is used to numerize the columns starting from 0
export function initializeLine(n: number, m: number, width: number): S.List<A.Actor> {
  if (m < 0 || n < 0 || width < 0) {
    throw new Error('Paramètre négatif interdit');
  }
  if (m === 0) {
    return S.nil;
  }
  return S.cons(
      A.set_position(C.fieldActor, A.createPos(n, width - m)), initializeLine(n, m - 1, width));
}

// Creates a list of lists (the world ie. a matrix)
// n : number of lines
// m : number of columns
// heigth : a variable equal to n that is only used for the right numeration of lines
// return a list of list, the world
export function initializeWorld(n: number, m: number, height: number): S.List<S.List<A.Actor>> {
  if (n < 0 || height < 0 || m < 0) {
    throw new Error('Paramètre négatif interdit');
  }
  if (n === 0) {
    return S.nil;
  }
  return S.cons(initializeLine(height - n, m, m), initializeWorld(n - 1, m, height));
}

// Returns element of the world in position i,j
export function worldGet(w: S.List<S.List<A.Actor>>, i: number, j: number): A.Actor {
  if (j < 0 || i < 0) {
    throw new Error('Pas les bons paramètres');
  }
  if (i === 0 && j === 0) {
    return S.head(S.head(w));
  }
  if (i !== 0) {
    return worldGet(S.tail(w), i - 1, j);
  }
  return S.listGet(S.tail(S.head(w)), j - 1);
}

// Sets element of the world in position i,j
export function worldSet(w: S.List<S.List<A.Actor>>, i: number, j: number, v: A.Actor): S.List<S.List<A.Actor>> {
  if (i < 0 || j < 0) {
    throw new Error('Problème au niveau des arguments');
  }
  function worldSetAux(w: S.List<S.List<A.Actor>>, i: number, j: number, v: A.Actor): S.List<S.List<A.Actor>> {
    if (S.isEmpty(S.head(w))) {
      return S.nil;
    }
    if (i === 0) {
      return S.cons(S.listSet(S.head(w), j, v), S.tail(w));
    }
    if (S.isEmpty(S.tail(w))) {
      return S.cons(S.head(w), worldSet(S.nil, i, j, v));
    }
    return S.cons(S.head(w), worldSet(S.tail(w), i - 1, j, v));
  }
  return worldSetAux(w, i, j, v);
}

// Tests if a position is a wall (at an extremity of the world)
// i, j : coordinates of a position
// width, height : dimension of the world
// return : a numbber (equivalent to a boolean)
export function isWall(i: number, j: number, width: number, height: number): number {
  if (i < 0 || i > height) {
    return 0;
  } else if (j < 0 || j > width) {
    return 0;
  }
  return 1;
}

// returns a random int between 0 and max-1
export function getRandomInt(max: number): number { return Math.floor(Math.random() * max); }

// returns a random staring position that is at an extremity of the world
// World : the world
// heigth, width : dimension of the world
// Return : an element of the world that will be a random starting position
export function getRandomStartPoint(world: S.List<S.List<A.Actor>>, height: number, width: number): A.Actor {
  const wallSelector = getRandomInt(4);
  // console.log(wallSelector);
  if (wallSelector === 0) { // the start point will be from the top line
                            // so i=0 and j random
    const i = 0;
    const j = getRandomInt(width);
    // console.log(i, j);
    return worldGet(world, i, j);
  }
  if (wallSelector === 1) { // the start ppoint is on the right column
    const i = getRandomInt(height);
    const j = width - 1;
    // console.log(i, j);
    return worldGet(world, i, j);
  }
  if (wallSelector === 2) { // the start point is in the bottom line
    const i = height - 1;
    const j = getRandomInt(width);
    // console.log(i, j);
    return worldGet(world, i, j);
  }
  // the start point is in the left column
  const i = getRandomInt(height);
  const j = 0;
  // console.log(i, j);
  return worldGet(world, i, j);
}

// Returns an ending position on the opposite edge of the starting point
// world : the world
// heigth, width : dimension of the world
// stratPoint : current starting point
// return : an element of the world that will be the ending position
export function getRandomEndPoint(
    world: S.List<S.List<A.Actor>>, height: number, width: number, startPoint: A.Actor): A.Actor {
  const startPosition = A.get_position(startPoint);
  if (A.get_pos_x(startPosition) === 0) { // start is in the upper line
    return A.set_position(startPoint, A.createPos(height - 1, getRandomInt(width)));
  } else if (A.get_pos_x(startPosition) === height - 1) { // start
                                                               // is in
                                                               // last
                                                               // line
    return A.set_position(startPoint, A.createPos(0, getRandomInt(width)));
  }
  if (A.get_pos_y(startPosition) === 0) { // startpoint is in the first column
    return A.set_position(startPoint, A.createPos(getRandomInt(height), width - 1));
  }
  return A.set_position(startPoint, A.createPos(getRandomInt(height), 0));
}

// Create a list of position that represents a path from a starting point to and ending point
// start : starting position
// end : ending position
// n : heigth of the board
// m : width of the board
export function createPath(start: A.Position, end: A.Position, n: number, m: number, previous_path : S.List<A.Position> = S.nil):
    S.List<A.Position> {
  const path = S.cons(end, S.nil);

  // dir : 0 (west), 1 (north), 2 (east), 3 (south)
  function aux(dir: number, currentStep: A.Position, end: A.Position, n: number, m: number, previous_path : S.List<A.Position>):
      {list: S.List<A.Position>, dist: number} {
    const currentDist: number = Math.abs(A.get_pos_x(end) - A.get_pos_x(currentStep)) +
                                Math.abs(A.get_pos_y(end) - A.get_pos_y(currentStep));
    let listPosition: S.List<A.Position> = S.nil;
    let dist = -1;
    let step: A.Position = A.createPos(-1, -1);

    if ((dir === 0) && (A.get_pos_y(currentStep) !== 0)) {
      step = A.createPos(A.get_pos_x(currentStep), A.get_pos_y(currentStep) - 1);
    } else if ((dir === 1) && (A.get_pos_x(currentStep) !== 0)) {
      step = A.createPos(A.get_pos_x(currentStep) - 1, A.get_pos_y(currentStep));
    } else if ((dir === 2) && (A.get_pos_y(currentStep) !== m - 1)) {
      step = A.createPos(A.get_pos_x(currentStep), A.get_pos_y(currentStep) + 1);
    } else if ((dir === 3) && (A.get_pos_x(currentStep) !== n - 1)) {
      step = A.createPos(A.get_pos_x(currentStep) + 1, A.get_pos_y(currentStep));
    }

    if ((A.get_pos_x(step) !== -1) && (A.get_pos_y(step) !== -1))
      dist = Math.abs(A.get_pos_x(end) - A.get_pos_x(step)) +
             Math.abs(A.get_pos_y(end) - A.get_pos_y(step));

    if ((dist !== -1) && (dist < currentDist) && !(S.isIn(previous_path, step, A.PosIsPos))) {
      listPosition = S.cons(step, S.nil);
      dist = 1;
    } else {
      dist = 0;
    }

    return {list : listPosition, dist : dist};
  }

  function randomStep(path: S.List<A.Position>, currentStep: A.Position, end: A.Position, previous_path : S.List<A.Position>):
      S.List<A.Position> {
    if ((A.get_pos_x(currentStep) === A.get_pos_x(end)) &&
        (A.get_pos_y(currentStep) === A.get_pos_y(end)))
      return path;
    else {
      const currentDist: number = Math.abs(A.get_pos_x(end) - A.get_pos_x(currentStep)) +
                                  Math.abs(A.get_pos_y(end) - A.get_pos_y(currentStep));

      const west = aux(0, currentStep, end, n, m, previous_path);
      const ouestlPS: S.List<A.Position> = west.list;
      const ouestDist = west.dist;

      const north = aux(1, currentStep, end, n, m, previous_path);
      const northlPS: S.List<A.Position> = north.list;
      const northDist = north.dist;

      const east = aux(2, currentStep, end, n, m, previous_path);
      const eastlPS: S.List<A.Position> = east.list;
      const eastDist = east.dist;

      const south = aux(3, currentStep, end, n, m, previous_path);
      const southlPS: S.List<A.Position> = south.list;
      const southDist = south.dist;

      const listPossibleStepProba: S.List<A.Position> =
          S.listMerge(S.listMerge(ouestlPS, northlPS), S.listMerge(eastlPS, southlPS));
      const randomStepNumber: number =
          Math.floor(Math.random() * (ouestDist + northDist + eastDist + southDist));

      const step: A.Position = S.listGet(listPossibleStepProba, randomStepNumber);
      if (step === S.nil)
        return path;
      else
        return randomStep(S.cons(step, path), step, end, previous_path);
    }
  }
  return randomStep(path, end, start, previous_path);
}


// Create a more complex path with an additionnal destination bewteen start and end
export function createPath_1(start: A.Position, end: A.Position, n: number, m: number): S.List<A.Position> 
{
  const x : number = Math.floor(Math.random() * (n-2)) + 1;
  const y : number = Math.floor(Math.random() * (m-2)) + 1;
  const step : A.Position = A.createPos(x, y);

  let first_path : S.List<A.Position> = createPath(step, start, n, m);
  const second_path : S.List<A.Position> = createPath(step, end, n, m);
  first_path = S.removeElement(first_path, 0);
  return S.listMerge(first_path, second_path);
}

// Create a more complex path with two additionnal destinations bewteen start and end
export function createPath_2(start: A.Position, end: A.Position, n: number, m: number): S.List<A.Position> 
{
  let x1 : number = 0;
  let y1 : number = 0;
  let x2 : number = 0;
  let y2 : number = 0;
  let step1 : A.Position = A.createPos(x1, y1);
  let step2 : A.Position = A.createPos(x2, y2);

  if ((A.get_pos_y(start) === 0) && (A.get_pos_y(end) === m-1))
  {
    x1 = Math.floor(Math.random() * (n - 2)) + 1;
    y1 = Math.floor(Math.random() * (Math.floor((m-2)/2))) + 1;
    step1 = A.createPos(x1, y1);

    x2 = Math.floor(Math.random() * (n - 2)) + 1;
    y2 = Math.floor(Math.random() * (Math.floor((m)/2))) + Math.floor((m-1)/2);
    step2 = A.createPos(x2, y2);
  }

  else if ((A.get_pos_y(start) === m-1) && (A.get_pos_y(end) === 0))
  {
    x1 = Math.floor(Math.random() * (n - 2) + 1);
    y1 = Math.floor(Math.random() * (Math.floor((m-1)/2))) + Math.floor((m)/2);
    step1 = A.createPos(x1, y1);

    x2 = Math.floor(Math.random() * (n - 2) + 1);
    y2 = Math.floor(Math.random() * (Math.floor((m-2)/2))) + 1;
    step2 = A.createPos(x2, y2);
  }

  else if ((A.get_pos_x(start) === 0) && (A.get_pos_x(end) === n-1))
  {
    x1 = Math.floor(Math.random() * (Math.floor((n-1)/2))) + 1;
    y1 = Math.floor(Math.random() * (m - 2)) + 1;
    step1 = A.createPos(x1, y1);

    x2 = Math.floor(Math.random() * (Math.floor((n)/2))) + Math.floor((n)/2);
    y2 = Math.floor(Math.random() * (m-2)) + 1;
    step2 = A.createPos(x2, y2);
  }

  else if ((A.get_pos_x(start) === n-1) && (A.get_pos_x(end) === 0))
  {
    x1 = Math.floor(Math.random() * (Math.floor((n)/2))) + Math.floor((n)/2);
    y1 = Math.floor(Math.random() * (m-2)) + 1;
    step1 = A.createPos(x1, y1);

    x2 = Math.floor(Math.random() * (Math.floor((n-1)/2))) + 1;
    y2 = Math.floor(Math.random() * (m-2)) + 1;
    step2 = A.createPos(x2, y2);
  }
  let first_path : S.List<A.Position> = createPath(step1, start, n, m);
  const second_path : S.List<A.Position> = createPath(step2, step1, n, m, first_path);
  first_path = S.listMerge(first_path, second_path);
  first_path = S.reverse(first_path);
  first_path = S.removeElement(first_path, 0);
  const third_path : S.List<A.Position> = createPath(step2, end, n, m, first_path);
  return S.listMerge(first_path, third_path);
}



// Create a more complex path with N additionnal destinations bewteen start and end 
export function createPath_N(start: A.Position, end: A.Position, n: number, m: number, N : number) : S.List<A.Position> 
{
  function random_pos_list(l : S.List<A.Position>, n : number, m : number, N : number, end : A.Position) : S.List<A.Position>
  {
    if (N === 0)
    {
      return S.cons(end, S.nil);
    }
    else
    {
      const x : number = Math.floor(Math.random() * (n-2)) + 1;
      const y : number = Math.floor(Math.random() * (m-2)) + 1;
      const pos : A.Position = A.createPos(x, y);
      if (S.isIn(l, pos, A.PosIsPos))
      {
        return random_pos_list(l, n, m, N, end);
      }
      else
      {
        return S.cons(pos, random_pos_list(l, n, m, N-1, end));
      }
    }
  }

  function make_list_path(l : S.List<A.Position>, n: number, m: number) : S.List<S.List<A.Position>>
  {
    if (S.isEmpty(S.tail(l)))
    {
      return S.nil;
    }
    else
    {
      return S.cons(createPath(S.head(l), S.head(S.tail(l)), n, m), make_list_path(S.tail(l), n, m));
    }
  }

  function reduce(l : S.List<S.List<A.Position>>, init : S.List<A.Position>) : S.List<A.Position>
  {
    if (S.isEmpty(l))
    {
      return init;
    }
    else
    {
      return reduce(S.tail(l), S.SuperMerge(init, S.head(l), A.PosIsPos));
    }
  }

  const list_pos : S.List<A.Position> = S.cons(start, random_pos_list(S.nil, n, m, N, end));
  listDispPosition(list_pos);
  const list_path : S.List<S.List<A.Position>> = make_list_path(list_pos, n, m);

  return reduce(S.tail(list_path), S.head(list_path));
}





// display through a console.log a list of positions. (used to test createPath function)
export function listDispPosition(L: S.List<A.Position>): void {
  function listDispAux(L: S.List<A.Position>): string {
    if (S.isEmpty(L))
      return '';
    else
      return '[' +
             `${A.get_pos_x(S.head(L))}, ${A.get_pos_y(S.head(L))}` +
             '] ' + listDispAux(S.tail(L));
  }
  console.log(listDispAux(L));
}

// Places on the world the path from a list of position (returned by create path).
export function copy_path_into_world(path: S.List<A.Position>, world: S.List<S.List<A.Actor>>):
    S.List<S.List<A.Actor>> {
  if (S.isEmpty(path))
    return world;
  else {
    const tile: A.Actor = A.set_position(C.pathActor, S.head(path));
    return copy_path_into_world(
        S.tail(path),
        worldSet(world, A.get_pos_x(S.head(path)), A.get_pos_y(S.head(path)), tile));
  }
}

// Refreshes the monsters after being attacked. Reverses the list of monsters.
export function worldRefreshMonsters(
    monsters: S.List<A.Actor>, world: S.List<S.List<A.Actor>>,
    refreshed_monsters: S.List < A.Actor >= S.nil): S.List<A.Actor> {
  if (S.isEmpty(monsters))
    return refreshed_monsters;
  const currentMonster = S.head(monsters);
  const currentX = A.get_x(currentMonster); 
  const currentY = A.get_y(currentMonster); 
  return worldRefreshMonsters(
      S.tail(monsters), world, S.cons(worldGet(world, currentX, currentY), refreshed_monsters));
}


// A function that puts the actors from the list in the world
export function fillWorld(world:S.List<S.List<A.Actor>>, list:S.List<A.Actor>): S.List<S.List<A.Actor>>{
  if(S.isEmpty(list)){
    return world;
  }
  const new_world=worldSet(
    world, A.get_pos_x(A.get_position(S.head(list))),
    A.get_pos_y(A.get_position(S.head(list))), S.head(list));
  return fillWorld(new_world,S.tail(list));
}

export function scanMonsters(world: S.List<S.List<A.Actor>>, remaining_path: S.List<A.Position>, scanned: S.List<A.Actor> = S.nil): S.List<A.Actor>
{
    if (S.isEmpty(remaining_path))
        return scanned;
    const currentPos = S.head(remaining_path);
    const current = worldGet(world, currentPos.x, currentPos.y);
    if (A.isMonster(A.get_id(current)))
        return scanMonsters(world, S.tail(remaining_path), S.cons(current, scanned));
    return scanMonsters(world, S.tail(remaining_path), scanned);
}

function red(str:string):string
{
  return "\x1b[31m"+str+"\x1b[0m";
}
export function addColor(path:S.List<A.Position>, targets: S.List<A.Position>, worldStr:string):string
{
  if (S.isEmpty(path))
    return worldStr;
  const current = S.head(path);
  if (S.isIn(targets, current, A.PosIsPos))
  {
    const x = A.get_pos_x(current);
    const y = A.get_pos_y(current);
    const text = worldStr.split("\n");
    const line = text[x].split(",");
    line[y] = red(line[y]);
    text[x] = line.join(",");
    return addColor(S.tail(path), targets, text.join("\n"));
  }

  return addColor(S.tail(path), targets, worldStr);
}
