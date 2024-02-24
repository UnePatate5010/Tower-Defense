export type PointedPair<T, U> = {
    car: T; cdr : U;
};

export function cons<T, U>(_car: T, _cdr: U): PointedPair<T, U> { return {car : _car, cdr : _cdr}; }

// Functions to type on pointed pairs
export function car<T, U>(cons: PointedPair<T, U>): T { return cons['car']; }
export function cdr<T, U>(cons: PointedPair<T, U>): U {
    return cons['cdr'];}

// Functions on lists

export type List<T> = undefined|{car : T, cdr : List<T>};

export const nil = undefined; // nil is automatically of type List<T>

export function isNonEmpty<T>(l: List<T>): l is PointedPair<T, List<T>> { return l !== nil; }

export function isEmpty<T>(l: List<T>): l is undefined { return !isNonEmpty(l); }


//Returns the head of the list l
export function head<T>(l: List<T>): T {
    if (isNonEmpty(l))
        return car(l);
    else
        throw new Error('N\'existe pas');
}

//Returns the tail of the list l
export function tail<T>(l: List<T>): List<T> {
    if (isNonEmpty(l))
        return cdr(l);
    else
        throw new Error('N\'existe pas');
}

//Detects if elmt is in the list L
export function isIn<T>(L: List<T>, elmt: T, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))): boolean {
    if (isEmpty(L))
    {
        return false;
    } else
    {
        // console.log(head(L))
        if (equalFunc(head(L), elmt))
            return true;
        else
            return isIn(tail(L), elmt, equalFunc);
    }
}


//Adds n times the element elmt in the list l
export function addNTimes<T>(L: List<T>, elmt: T, n: number): List<T> {
    if (n === 0)
        return L;
    else
        return addNTimes(cons(elmt, L), elmt, n - 1);
}

// merge 2 list whatever the order is
export function listMerge<T>(L1: List<T>, L2: List<T>): List<T> {
    if (isEmpty(L1))
        return L2;
    else
        return listMerge(tail(L1), cons(head(L1), L2));
}

export function listMergeUniq<T>(L1: List<T>, L2: List<T>, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))): List<T> {
    if (isEmpty(L1))
        return L2;
    const current = head(L1);
    if (isIn(L2, current, equalFunc))
        return listMergeUniq(tail(L1), L2, equalFunc);
    return listMergeUniq(tail(L1), cons(current, L2), equalFunc);
}

//Computes a fold with the function f on the list l
export function listFoldL<T, U>(f: (init: U, x: T) => U, l: List<T>, init: U): U {
    if (isEmpty(l))
        return init;
    return listFoldL(f, tail(l), f(init, head(l)));
}

//Returns a list where element l are inversed
export function reverse<T>(l: List<T>) {
    function reverseaux<T>(l: List<T>, acc: List<T>): List<T> {
        if (isEmpty(l))
            return acc;
        return reverseaux(tail(l), cons(head(l), acc));
    }
    return reverseaux(l, nil);
}

//Computes a map function f on the list l
export function listMap<T, U>(f: (x: T) => U, l: List<T>): List<U> {
    if (isEmpty(l))
        return nil;
    function listMapaux<T>(f: (x: T) => U, l: List<T>, acc: List<U>): List<U> {
        if (isEmpty(l))
            return acc;
        return listMapaux(f, tail(l), cons(f(head(l)), acc));
    }
    return reverse(listMapaux(f, l, nil));
}

// Return element of the list in position i
export function listGet<T>(l: List<T>, i: number): T {
    if (isEmpty(l)) {
        throw new Error('Pas les bons paramètres');
    }
    if (i === 0) {
        return head(l);
    }
    return listGet(tail(l), i - 1);
}

//Set the element at index i to v in list l
export function listSet<T>(l: List<T>, i: number, v: T): List<T> {
    if (isEmpty(l)) {
        nil;
    }
    function listSetAux<T>(l: List<T>, i: number, v: T): List<T> {
        // if (S.isEmpty(l) && (i < 0)) {
        //   throw new Error('Indice invalide');
        // }
        if (isEmpty(l)) {
            nil;
        }
        if (i === 0) {
            return cons(v, tail(l));
        }
        return cons(head(l), listSetAux(tail(l), i - 1, v));
    }
    return listSetAux(l, i, v);
}

//Returns the length of the list l
export function length<T>(l : List<T>) : number
{
    if (isEmpty(tail(l)))
    {
        return 1;
    }
    else
    {
        return 1 + length(tail(l));
    }
}

//Removes the element on index i in the list l
export function removeElement<T>(l : List<T>, i : number) : List<T>
{
    if (i === 0)
    {
        return tail(l);
    }
    else
    {
        return cons(head(l), removeElement(tail(l), i-1));
    }
}

export function removeSpecificElement<T>(l : List<T>, elmt : T, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : List<T>
{
    if (isEmpty(l))
    {
        return nil;
    }
    else
    {
        if (equalFunc((head(l)), elmt))
            return tail(l);
        else
            return cons(head(l), removeSpecificElement(tail(l), elmt, equalFunc));
    }
}

// élément non compris
export function removeAfterElement<T>(l : List<T>, elmt : T, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : List<T>
{
    if (equalFunc(elmt, head(l)))
    {
        return cons(elmt, nil);
    }
    else
    {
        return cons(head(l), removeAfterElement(tail(l), elmt, equalFunc));
    }
}

// élément compris
export function removeBeforeElement<T>(l : List<T>, elmt : T, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : List<T>
{
    if (equalFunc(elmt, head(l)))
    {
        return tail(l);
    }
    else
    {
        return removeBeforeElement(tail(l), elmt, equalFunc);
    }
}


export function SuperMerge<T>(l1 : List<T>, l2 : List<T>, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : List<T>
{
    function aux<T>(l1 : List<T>, l2 : List<T>, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : T
    {
        if (isEmpty(tail(l1)))
        {
            return head(l1);
        }
        else
        {
            if (isIn(l2, head(l1), equalFunc))
            {
                return head(l1);
            }
            else
            {
                return aux(tail(l1), l2, equalFunc);
            }
        }
    }
    const elmt : T = aux(l1, l2, equalFunc);
    const pre : List<T> = removeAfterElement(l1, elmt, equalFunc);
    const post : List<T> = removeBeforeElement(l2, elmt, equalFunc);
    return listMerge(reverse(pre), post);
}


// Supermerge aux function (is a the exterior only for tests)
export function aux_test<T>(l1 : List<T>, l2 : List<T>, equalFunc: ((x: T, y: T) => boolean) = ((x: T, y: T) => (x === y))) : T
{
    if (isEmpty(tail(l1)))
    {
        return head(l1);
    }
    else
    {
        if (isIn(l2, head(l1), equalFunc))
        {
            return head(l1);
        }
        else
        {
            return aux_test(tail(l1), l2, equalFunc);
        }
    }
}