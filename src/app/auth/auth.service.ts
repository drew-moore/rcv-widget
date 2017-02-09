import {Injectable} from "@angular/core";
import {AngularFireAuth} from "angularfire2";
import {AppState, getAuthState, getAuthUserId, getAuthUser} from "../state";
import {Store} from "@ngrx/store";
import {User} from "../core/user/user.model";
import * as userFxns from "../core/user/user.functions";
import {
  LoginSuccessAction,
  SocialAuthProvider,
  LoginAction,
  LogoutAction,
  AuthState,
  PasswordSignupAction,
  AuthActions
} from "./auth.state";
import {Observable} from "rxjs";
import {Actions} from "@ngrx/effects";
import FirebaseError = firebase.FirebaseError;

@Injectable()
export class AuthService {

  public readonly state$: Observable<AuthState>;

  public readonly sessionUser$: Observable<User|null>;

  public readonly sessionUserId$: Observable<string|null>;

  constructor(private backend: AngularFireAuth, private store: Store<AppState>, private actions: Actions) {

    this.state$ = store.select(getAuthState);
    this.sessionUser$ = store.select(getAuthUser);
    this.sessionUserId$ = store.select(getAuthUserId);


    this.backend.take(1).subscribe(val => {
      /*
       * The store always initializes to an unauthenticated state - we don't know whether a user is authenticated until the
       * app is bootstrapped and we get this first tick from the backend svc. So, we listen for that tick, and if indeed
       * we have an authenticated user, update (essentially reinitialize) the store accordingly.
       *
       * From there, all changes are triggered by login/logout events. The limitation here is that if a user logs in/out in
       * another tab, that won't be updated here until refresh. If we need to support that, we can do a combineLatest(backend, state),
       * and compare each pair of values to see if they don't match.
       * */
      let user: User|null = userFxns.forAuthState(val);
      if (user != null) {
        this.store.dispatch(new LoginSuccessAction(user));
      }
    })
  }

  public login(input: SocialAuthProvider|{ email: string, password: string }): Observable<boolean> {
    this.store.dispatch(new LoginAction(input));
    return Observable.merge(
      this.actions.ofType(AuthActions.LOGIN_SUCCESS).take(1).map(() => true),
      this.actions.ofType(AuthActions.ERROR).take(1).map(() => false)
    ).take(1);
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }

  public signup(input: { email: string, password: string, name: string }): Observable<boolean> {
    this.store.dispatch(new PasswordSignupAction(input));
    return Observable.merge(
      this.actions.ofType(AuthActions.PASSWORD_SIGNUP_SUCCESS).take(1).map(() => true),
      this.actions.ofType(AuthActions.ERROR).take(1).map(() => false)
    ).take(1);
  }


}

