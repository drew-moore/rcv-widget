import {Injectable} from "@angular/core";
import * as firebase from "firebase";
import {
  SocialAuthProvider,
  AuthActions,
  LoginAction,
  AuthErrorAction,
  LoginSuccessAction,
  LogoutSuccessAction,
  PasswordSignupAction,
  SignupSuccessAction
} from "./auth.state";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Observable, Observer} from "rxjs";
import {User} from "../core/user/user.model";
import * as userFxns from "../core/user/user.functions";
import {FirebaseAuthState, AuthMethods, AngularFireAuth, AuthProviders, AngularFireDatabase} from "angularfire2";

import FirebaseError = firebase.FirebaseError;

@Injectable()
export class AuthEffects {

  @Effect()
  doSocialLoginsEffect: Observable<LoginSuccessAction|AuthErrorAction> = this.actions.ofType(AuthActions.LOGIN)
    .map(action => action as LoginAction)
    .filter(action => action.isSocialLogin())
    .map(toPayload)
    .map(it => it as SocialAuthProvider)
    .flatMap(provider => this.doSocialLogin(provider));

  @Effect()
  doEmailLoginsEffect: Observable<LoginSuccessAction|AuthErrorAction> = this.actions.ofType(AuthActions.LOGIN)
    .map(action => action as LoginAction)
    .filter(action => !action.isSocialLogin())
    .map(toPayload)
    .map(it => it as { email: string, password: string })
    .flatMap(creds => this.doPasswordLogin(creds));

  @Effect()
  doPasswordSignupsEffect: Observable<SignupSuccessAction|AuthErrorAction> =
    this.actions.ofType(AuthActions.PASSWORD_SIGNUP)
      .map(action => action as PasswordSignupAction)
      .map(toPayload)
      .flatMap(input => this.doPasswordSignup(input));


  @Effect()
  doLogoutEffect = this.actions.ofType(AuthActions.LOGOUT)
    .flatMap(() => this.doLogout());

  /*
   we use the DB here to create new user objects for password signups. We'd really rather abstract that into another service,
   but
   */
  constructor(private actions: Actions, private backend: AngularFireAuth, private db: AngularFireDatabase) {


  }


  /**
   * the return value here is solely for error catching
   * @param provider
   */
  private doSocialLogin(provider: SocialAuthProvider): Observable<LoginSuccessAction|AuthErrorAction> {

    return Observable.create((observer: Observer<LoginSuccessAction|AuthErrorAction>) => {
      this.backend.login({
        provider: providerMap[ provider ],
        method: AuthMethods.Popup
      }).then((it: FirebaseAuthState) => {
        let user: User|null = userFxns.forAuthState(it);
        if (user == null) {
          console.error('login promise resolved successfully, but user is still null?');
          return observer.complete();
        } else {
          return observer.next(new LoginSuccessAction(user));
        }
      }).catch((err: FirebaseError) => {
        return observer.next(new AuthErrorAction(err));
      });
    }).take(1);
  }

  private doPasswordLogin(creds: { email: string, password: string }): Observable<LoginSuccessAction|AuthErrorAction> {
    return Observable.create((observer: Observer<LoginSuccessAction|AuthErrorAction>) => {
      this.backend.login({ email: creds.email, password: creds.password }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      })
        .then((it: FirebaseAuthState) => {
          let user: User|null = userFxns.forAuthState(it);
          if (user == null) {
            console.error('login promise resolved successfully, but user is still null?');
            return observer.complete();
          } else {
            return observer.next(new LoginSuccessAction(user));
          }
        }).catch((err: FirebaseError) => {
        return observer.next(new AuthErrorAction(err));
      });

    }).take(1);
  }

  private doPasswordSignup(info: { email: string, password: string, name: string }): Observable<LoginSuccessAction|AuthErrorAction> {
    return Observable.create((observer: Observer<LoginSuccessAction|AuthErrorAction>) => {
      this.backend.createUser({ email: info.email, password: info.password })
        .then((val: FirebaseAuthState) => {
            /*in this case, we've created an auth user object, but it doesn't have name etc. info imported from a social provider  */

            let user: User = userFxns.forAny({
              name: info.name,
              image: '',
              isVerified: false,
              id: val.uid
            });

            return observer.next(new SignupSuccessAction(user));

          }
        ).catch(err => observer.error(err));

    }).take(1);
  }


  private doLogout(): Observable<LogoutSuccessAction|AuthErrorAction> {
    return Observable.create((observer: Observer<LogoutSuccessAction|AuthErrorAction>) => {
      this.backend.logout().then(() => {
        observer.next(new LogoutSuccessAction());
      }).catch(err => {
        observer.next(new AuthErrorAction(err));
      })
    }).take(1);
  }

}


const providerMap: { [x: string]: AuthProviders } = {
  'facebook': AuthProviders.Facebook,
  'twitter': AuthProviders.Twitter,
  'google': AuthProviders.Google,
};
