import {Poll, PartialPoll} from "./poll.models";
import {Action} from "@ngrx/store";
export interface PollsState {
  ids: string[],
  entities: { [id: string]: Poll };
}

export const PollsActions = {
  LOAD_POLL: '[Polls] loadPoll',
  POLL_LOADED: '[Polls] pollLoaded',
  CREATE_POLL: '[Polls] createPoll',
  POLL_CREATED: '[Polls] pollCreated'
};

export class LoadPollAction implements Action {
  public readonly type = PollsActions.LOAD_POLL;

  constructor(public readonly payload: string) {}
}

export class PollLoadedAction implements Action {
  public readonly type = PollsActions.POLL_LOADED;

  constructor(public readonly payload: Poll) {}
}

export class CreatePollAction implements Action {
  public readonly type = PollsActions.CREATE_POLL;

  constructor(public readonly payload: PartialPoll) {}
}

export class PollCreatedAction implements Action {
  public readonly type = PollsActions.POLL_CREATED;

  constructor(public readonly payload: Poll) {}
}


export const getPollIds = (state: PollsState) => state.ids;

export const getPollEntities = (state: PollsState) => state.entities;
