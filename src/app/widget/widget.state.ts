import {Action} from "@ngrx/store";

export interface WidgetState {
  activePoll: string|undefined;
}

export const WidgetActions = {
  ACTIVATE_POLL: '[Widget] activatePoll'
};

export class ActivatePollAction implements Action {
  public readonly type = WidgetActions.ACTIVATE_POLL;

  constructor(public readonly payload: string) {}
}

const initialState: WidgetState = { activePoll: undefined };

export function widget(state: WidgetState = initialState, action: Action): WidgetState {
  switch (action.type) {
    case WidgetActions.ACTIVATE_POLL:
      return {
        activePoll: (action as ActivatePollAction).payload
      };
    default:
      return state;
  }
}


export const getActivePollId = (state: WidgetState) => state.activePoll;
