import {FirebaseAuthState} from "angularfire2";
import {keys} from "lodash";
import {User, RequiredUserField, OptionalUserField, UserField, UserEntity} from "./user.model";

const REQUIRED_USER_FIELDS: RequiredUserField[] = [ 'id', 'name', 'image', 'isVerified' ];
const OPTIONAL_USER_FIELDS: OptionalUserField[] = [ 'polls', 'votes' ];
const USER_FIELDS: UserField[] = [ ...REQUIRED_USER_FIELDS, ...OPTIONAL_USER_FIELDS ];

export function forAuthState(state: FirebaseAuthState): User|null {

  if (state == null || state.auth == null) {
    return null;
  }

  let name = state.auth.displayName || '';
  let image = state.auth.photoURL || '';
  let isVerified = state.auth.emailVerified === true;

  return {
    id: state.uid,
    name,
    image,
    isVerified
  }

}

export function forAny(input: any): User {

  //TODO sanitize

  return {
    id: input.id as string,
    name: input.name as string,
    image: input.image as string,
    isVerified: input.isVerified as boolean,
    polls: input.polls || {},
    votes: input.votes || {}
  }
}

export function forEntity(it: UserEntity): User|null {
  if (!it.$exists()) {
    return null;
  } else {
    return forAny(Object.assign({}, it, { id: it.$key }));
  }
}


export function usersEqual(x: User, y: User): boolean {
  if ((!x && !!y) || (!!x && !y)) {
    //exactly one is undefined
    return false;
  }

  if (!(!!x || !!y)) {
    //both are undefined
    return true;
  }

  for (let i = 0; i < REQUIRED_USER_FIELDS.length; i++) {
    if (x[ REQUIRED_USER_FIELDS[ i ] ] !== y[ REQUIRED_USER_FIELDS[ i ] ]) {
      return false;
    }
  }

  if (!((!!x.polls && !!y.polls) || (!x.polls && !y.polls) )) {
    return false;
  }

  if (!((!!x.votes && !!y.votes) || (!x.votes && !y.votes) )) {
    return false;
  }

  if (keys(x.polls).length !== keys(y.polls).length) {
    return false;
  }

  if (keys(x.votes).length !== keys(y.votes).length) {
    return false;
  }

  return true;
}

export function mergeUsers(target: User, source: User): User {
  return Object.assign({}, target, source);//todo
}
