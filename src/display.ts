import * as A from './actors.js';
import * as S from './structures.js';

// List of visual elements
export const str = "ಡඞ☯ꔢ□■";

// A function that displays an actor
export function listDispActor(l: S.List<A.Actor>): string {

  function listDispRec(l: S.List<A.Actor>): string {
    if (S.isEmpty(l))
      return '';
    else if (S.isEmpty(S.tail(l)))
      return str[A.get_id(S.head(l))];
    else
      return `${str[A.get_id(S.head(l))]},${listDispRec(S.tail(l))}`;
  }
  return `[${listDispRec(l)}]`;
}

// A function that display the world with the respective utf-8 characters.
export function worldDisp(m: S.List<S.List<A.Actor>>): string {
  return S.listFoldL(
             (acc: string, el: string) => `${acc}${el}\n`, S.listMap(listDispActor, m), '');
}
