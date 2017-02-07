import {Action} from "@ngrx/store";
import {User} from "../core/user/user.model";

export type SocialAuthProvider = 'facebook'|'twitter'|'google';

export type AuthError = { code: string, message: string };

export interface AuthState {
  user: User|null;
  pending: boolean;
  error?: AuthError;
}


export const AuthActions = {
  LOGIN: '[Auth] login',
  LOGIN_SUCCESS: '[Auth] loginSuccess',
  LOGOUT: '[Auth] logout',
  LOGOUT_SUCCESS: '[Auth] logoutSuccess',
  ERROR: '[Auth] loginError',
  PASSWORD_SIGNUP: '[Auth] passwordSignup',
  PASSWORD_SIGNUP_SUCCESS: '[Auth] passwordSignupSuccess'
};


export class LoginAction implements Action {
  type = AuthActions.LOGIN;

  constructor(public payload: string|{ email: string, password: string }) {
  }

  isSocialLogin() {
    return typeof this.payload === 'string';
  }
}

export class LoginSuccessAction implements Action {
  type = AuthActions.LOGIN_SUCCESS;

  constructor(public payload: User) {}
}

export class LogoutAction implements Action {
  type = AuthActions.LOGOUT;
  payload = null;
}

export class LogoutSuccessAction implements Action {
  type = AuthActions.LOGOUT_SUCCESS;
  payload = null;
}

export class AuthErrorAction implements Action {
  type = AuthActions.ERROR;

  constructor(public payload: Error) {}
}

export class SignupSuccessAction implements Action {
  type = AuthActions.PASSWORD_SIGNUP_SUCCESS;

  constructor(public payload: User) {}
}

export class PasswordSignupAction implements Action {
  type = AuthActions.PASSWORD_SIGNUP;

  constructor(public readonly payload: { email: string, password: string, name: string }) {}
}


const initialState: AuthState = {
  user: null,
  pending: false
};

export function auth(state = initialState, action: Action): AuthState {

  switch (action.type) {
    case AuthActions.LOGIN:
    case AuthActions.LOGOUT:
    case AuthActions.PASSWORD_SIGNUP:
      return Object.assign({}, state, { pending: true });

    case AuthActions.LOGIN_SUCCESS:
      return {
        pending: false,
        user: (action as LoginSuccessAction).payload
      };

    case AuthActions.LOGOUT_SUCCESS:
      return {
        pending: false,
        user: null
      };

    case AuthActions.ERROR:
      return Object.assign({}, state, { pending: false, error: action.payload });

    default:
      return state;

  }

}


export const getAuthUser = (state: AuthState) => state.user;
