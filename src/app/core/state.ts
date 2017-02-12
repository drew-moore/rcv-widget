import {Action} from "@ngrx/store";

export const CoreActions = {
  ACTIVATE_POLL: '[Widget] activatePoll',
  SESSION_USER_CHANGED: '[User] sessionUserChange'
};

export class ActivatePollAction implements Action {
  public readonly type = CoreActions.ACTIVATE_POLL;

  constructor(public readonly payload: string) {}
}

export class SessionUserChangedAction implements Action {
  public readonly type = CoreActions.SESSION_USER_CHANGED;

  constructor(public readonly payload: string) {}
}

export function activePoll(state: string|null = null, action: Action): string|null {
  switch (action.type) {
    case CoreActions.ACTIVATE_POLL:
      return (action as ActivatePollAction).payload;
    default:
      return state;
  }
}

export function sessionUser(state: string, action: Action): string {
  switch (action.type) {
    case CoreActions.SESSION_USER_CHANGED:
      return (action as SessionUserChangedAction).payload;
    default:
      return state;
  }
}

