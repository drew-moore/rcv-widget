import {PollsState, PollsActions, PollLoadedAction} from "./polls.state";
import {Action} from "@ngrx/store";
import {Poll} from "./poll.models";
import {pollsEqual} from "./poll.functions";
const initialState: PollsState = {
  ids: [],
  entities: {}
};


export function polls(state: PollsState = initialState, action: Action): PollsState {
  switch (action.type) {

    case PollsActions.POLL_LOADED:
      let loadedPoll: Poll = (action as PollLoadedAction).payload;

      if (state.ids.indexOf(loadedPoll.id) < 0) {
        return {
          ids: [ ...state.ids, loadedPoll.id ],
          entities: Object.assign({}, state.entities, { [loadedPoll.id]: loadedPoll })
        }
      } else if (!pollsEqual(loadedPoll, state.entities[ loadedPoll.id ])) {
        //if the data hasn't changed, just return the old reference to prevent a CD round
        return {
          ids: state.ids, //it's id was already there
          entities: Object.assign({}, state.entities,
            {
              //overwriting old values with newly loaded ones
              [loadedPoll.id]: Object.assign({}, state.entities[ loadedPoll.id ], loadedPoll)
            }
          )
        }
      } else {
        //else the id already exists and the data hasn't changed, so do nothing
        return state;
      }

    default:
      return state;
  }
}
