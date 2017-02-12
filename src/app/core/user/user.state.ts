import {User} from "./user.model";
import {Action} from "@ngrx/store";
import {usersEqual, mergeUsers} from "./user.functions";


export interface UsersState {
  ids: string[],
  entities: { [id: string]: User }
}


export const UserActions = {
  LOAD_USER_DATA: '[User] load',
  USER_DATA_LOADED: '[User] loaded',
};

export class LoadUserDataAction implements Action {
  public readonly type = UserActions.LOAD_USER_DATA;

  constructor(public readonly payload: string) {}
}

export class UserDataLoadedAction implements Action {
  public readonly type = UserActions.USER_DATA_LOADED;

  constructor(public readonly payload: User) {}

}



const initialState: UsersState = {
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
            ids: state.ids,
            entities: Object.assign({}, state.entities, { [data.id]: mergeUsers(state.entities[ data.id ], data) })
          }
        }
      } else {
        return {
          ids: [ ...state.ids, data.id ],
          entities: Object.assign({}, state.entities, { [data.id]: data })
        }
      }

    default:
      return state;
  }
}
export const getLoadedUserIds = (state: UsersState) => state.ids;

export const getLoadedUserData = (state: UsersState) => state.entities;
