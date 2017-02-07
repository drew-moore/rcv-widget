import {FirebaseAuthState} from "angularfire2";
import {User} from "./user.model";

export function forAuthState(state: FirebaseAuthState): User|null {

  if (state == null || state.auth == null) {
    return null;
  }

  return {
    id: state.uid,
    name: state.auth.displayName as string,
    image: state.auth.photoURL as string,
    isVerified: state.auth.emailVerified
  }

}


export function forAny(input: any) {

}
