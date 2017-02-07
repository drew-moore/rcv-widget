import {keys, values} from "lodash";
import {User} from "./user.model";
import {Action} from "@ngrx/store";
import {createSelector} from "reselect";
import {usersEqual, mergeUsers} from "./user.functions";


export interface UsersState {
  sessionUserId: string|null;
  ids: string[],
  entities: { [id: string]: User }
}


export const UserActions = {
  LOAD_USER_DATA: '[User] load',
  USER_DATA_LOADED: '[User] loaded',
  SESSION_USER_CHANGED: '[User] sessionUserChange'
};

export class LoadUserDataAction implements Action {
  public readonly type = UserActions.LOAD_USER_DATA;

  constructor(public readonly payload: string) {}
}

export class UserDataLoadedAction implements Action {
  public readonly type = UserActions.USER_DATA_LOADED;

  constructor(public readonly payload: User) {}

}

export class SessionUserChangedAction implements Action {
  public readonly type = UserActions.SESSION_USER_CHANGED;

  constructor(public readonly payload: string|null) {}
}

const initialState: UsersState = {
  sessionUserId: null,
  ids: [],
  entities: {}
};

export function users(state: UsersState = initialState, action: Action): UsersState {
  switch (action.type) {
    case UserActions.USER_DATA_LOADED:
      let data = (action as UserDataLoadedAction).payload;
      if (state.ids.indexOf(data.id) >= 0) {
        if (usersEqual(state.entities[ data.id ], data)) {
          //if nothing has changed, don't emit a new state
          return state;
        } else {
          return {
            sessionUserId: state.sessionUserId,
            ids: state.ids,
            entities: Object.assign({}, state.entities, { [data.id]: mergeUsers(state.entities[ data.id ], data) })
          }
        }
      } else {
        return {
          sessionUserId: state.sessionUserId,
          ids: [ ...state.ids, data.id ],
          entities: Object.assign({}, state.entities, { [data.id]: data })
        }
      }

    case UserActions.SESSION_USER_CHANGED:
      return {
        sessionUserId: (action as SessionUserChangedAction).payload,
        ids: state.ids,
        entities: state.entities
      };

    default:
      return state;
  }
}
export const getLoadedUserIds = (state: UsersState) => state.ids;

export const getLoadedUserData = (state: UsersState) => state.entities;

export const getSessionUserId = (state: UsersState) => state.sessionUserId;

export const getSessionUserData = createSelector(getSessionUserId, getLoadedUserData, (id, data) => {
  if (!id || !data[ id ]) {
    return null;
  }
  return data[ id ];
});

export const getSessionUserPollIds = createSelector(getSessionUserData, (data) => {
  if (!data) {
    return [];
  }
  return keys((data as User).polls);
});

export const getSessionUserVoteIds = createSelector(getSessionUserData, (data) => {
  if (!data) {
    return [];
  }
  //keys here are forAny ID's
  return values((data as User).votes);
});


export const getPollIdsSessionUserHasVotedIn = createSelector(getSessionUserData, (data) => {
  let votes: { [id: string]: string };
  if (!data || !data.votes) {
    return [];
  } else {
    votes = (data as User).votes as { [id: string]: string };
  }

  //keys here are forAny ID's
  return keys(votes).map(pollId => ({ pollId, voteId: votes[ pollId ] }));
});


