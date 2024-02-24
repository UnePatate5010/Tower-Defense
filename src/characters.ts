import * as A from "./actors.js";
import * as S from "./structures.js";

// This file will contain the most used types of actors

// == World ==
export const fieldActor =
    A.createActor(A.Actortype.field, A.createPos(-1, -1), -1, -1, -1, -1, -1, S.nil);
export const pathActor =
    A.createActor(A.Actortype.path, A.createPos(-1, -1), -1, -1, -1, -1, -1, S.nil);

// == Towers ==
export const tower1Actor =
    A.createActor(A.Actortype.tower, A.createPos(-1, -1), 1, 0, -1, 50, 4, S.nil);
export const tower2Actor =
    A.createActor(A.Actortype.annihilator, A.createPos(-1, -1), 3, 0, -1, 30, 3, S.nil);

// == Monsters ==
export const mudmanActor =
    A.createActor(A.Actortype.mudman, A.createPos(-1, -1), 1, 0, 5, 30, -1, S.nil);
export const susActor =
    A.createActor(A.Actortype.sus, A.createPos(-1, -1), 2, 0, 10, 55, -1, S.nil);

// == A spawner ==
export const spawnerActor =
    A.createActor(A.Actortype.mudman, A.createPos(-1, -1), -1, 0, -1, 30, -1, S.nil);
