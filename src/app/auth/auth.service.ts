import {Injectable} from "@angular/core";
import {AngularFireAuth, FirebaseAuthState, AuthMethods, AuthProviders} from "angularfire2";
import {AppState, getAuthState, getAuthUserId, getAuthUserInfo} from "../state";
import {Store} from "@ngrx/store";
import {
  LoginSuccessAction,
  SocialAuthProvider,
  LoginAction,
  LogoutAction,
  AuthState,
  PasswordSignupAction,
  AuthActions,
  AuthInfo,
  LogoutSuccessAction
} from "./auth.state";
import {Observable, Observer} from "rxjs";
import {Actions} from "@ngrx/effects";
import FirebaseError = firebase.FirebaseError;
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {

  public readonly state$: Observable<AuthState>;

  public readonly sessionUser$: Observable<AuthInfo|null>;

  public readonly sessionUserId$: Observable<string|null>;

  constructor(private backend: AngularFireAuth, private store: Store<AppState>, private actions: Actions) {

    this.state$ = store.select(getAuthState);
    this.sessionUser$ = store.select(getAuthUserInfo);
    this.sessionUserId$ = store.select(getAuthUserId);


    this.backend.take(1).subscribe((authState: FirebaseAuthState) => {
      /*
       * The store always initializes to an unauthenticated state - we don't know whether a user is authenticated until the
       * app is bootstrapped and we get this first tick from the backend svc. So, we listen for that tick, and if indeed
       * we have an authenticated user, update (essentially reinitialize) the store accordingly.
       *
       * From there, all changes are triggered by login/logout events. The limitation here is that if a user logs in/out in
       * another tab, that won't be updated here until refresh. If we need to support that, we can do a combineLatest(backend, state),
       * and compare each pair of values to see if they don't match.
       * */

      if (authState == null) {
        this.loginAnonymously().subscribe(state => {
          this.store.dispatch(new LogoutSuccessAction(toAuthInfo(state)));
        })
      } else if (authState.auth == null) {
        this.store.dispatch(new LogoutSuccessAction(toAuthInfo(authState)));
      }
      else {
        this.store.dispatch(new LoginSuccessAction(toAuthInfo(authState)));
      }

    });

  }

  private loginAnonymously(): Observable<FirebaseAuthState> {
    return Observable.create((observer: Observer<FirebaseAuthState>) => {
      this.backend.login({
        provider: AuthProviders.Anonymous,
        method: AuthMethods.Anonymous
      }).then(state => {
        return observer.next(state);
      }).catch(err => {
        return observer.error(err);
      })
    }).take(1);
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

export function toAuthInfo(state: FirebaseAuthState): AuthInfo {
  if (state.anonymous) {
    return {
      anonymous: true,
      uid: state.uid
    }
  } else if (state.auth != null) {
    return {
      anonymous: false,
      uid: state.uid,
      displayName: state.auth.displayName || undefined,
      emailVerified: state.auth.emailVerified,
      photoUrl: state.auth.photoURL || undefined
    }
  } else {
    throw `AuthState is not anonymous but state.auth is null.`
  }
}
