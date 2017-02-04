import {Poll} from "./poll.models";
import {keys} from "lodash";
import {mockPoll} from "../fixtures";
import {PollsState, PollLoadedAction} from "./polls.state";
import {polls} from "./polls.reducer";


describe('polls reducer', () => {
  let poll: Poll;
  let state: PollsState;

  beforeEach(() => {
    poll = mockPoll();
    state = {
      ids: [ poll.id ],
      entities: { [poll.id]: poll }
    }
  });

  it('should return the same object reference if no data has changed', () => {

    let reducedState = polls(state, new PollLoadedAction(poll));

    expect(reducedState).toBe(state);

  });

  it('should add newly-loaded polls correctly', () => {
    let nextPoll: Poll,
      nextState: PollsState,
      lastState: PollsState = state;

    for (let i = 0; i < 10; i++) {
      nextPoll = mockPoll();
      nextState = polls(lastState, new PollLoadedAction(nextPoll));
      expect(lastState).not.toEqual(nextState);
      expect(nextState.ids.length).toEqual(lastState.ids.length + 1);
      expect(keys(nextState.entities)).toEqual([ ...keys(lastState.entities), nextPoll.id ]);
      expect(nextState.entities[ nextPoll.id ]).toEqual(nextPoll);
    }
  });

  it('should behave as expected when updating previously-loaded data', () => {

    let updated = Object.assign({}, poll, {
      prompt: 'updated prompt'
    });

    let newState = polls(state, new PollLoadedAction(updated));

    expect(newState).not.toEqual(state);

    expect(newState.ids).toEqual(state.ids);
    expect(keys(newState.entities)).toEqual(keys(state.entities));

    expect(newState.entities).not.toBe(state.entities);

    expect(newState.entities[ poll.id ]).not.toEqual(state.entities[ poll.id ]);

    expect(newState.entities[ poll.id ]).not.toBe(updated);
    expect(newState.entities[ poll.id ]).toEqual(updated);

  })


});
