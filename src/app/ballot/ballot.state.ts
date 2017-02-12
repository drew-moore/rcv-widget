import {shuffle, values} from "lodash";
import {Action} from "@ngrx/store";
import {Poll, PollOption} from "../core/poll/poll.models";
import {Vote} from "../core/vote/vote.models";

export type BallotOption = PollOption & {
  selectedIndex: number;
  unselectedIndex: number
}

export interface BallotState {
  numSelected: number,
  ids: string[],
  options: { [id: string]: BallotOption; },
  lastAction: 'click'|'drag'
}

export const BallotActions = {
  INITIALIZE: '[Ballot] initialize',
  SELECTION_ADDED: '[Ballot] selectionAdded',
  SELECTION_REMOVED: '[Ballot] selectionRemoved',
  SELECTIONS_REORDERED: '[Ballot] selectionsReordered',
  ACTION_TYPE_CHANGE: '[Ballot] actionTypeChange'
};


export class InitializeBallotAction implements Action {
  type = BallotActions.INITIALIZE;
  public readonly payload: { poll: Poll, vote: Vote|null };

  constructor(poll: Poll, vote: Vote|null = null) {
    this.payload = { poll, vote };
  }
}

export class SelectionAddedAction implements Action {
  type = BallotActions.SELECTION_ADDED;

  constructor(public payload: BallotOption) {}
}

export class SelectionRemovedAction implements Action {
  type = BallotActions.SELECTION_REMOVED;

  constructor(public payload: BallotOption) {}
}


export class SelectionsReordereddAction implements Action {
  type = BallotActions.SELECTIONS_REORDERED;

  constructor(public payload: { fromIndex: number, toIndex: number }) {}
}

export class ActionTypeChangedAction implements Action {
  type = BallotActions.ACTION_TYPE_CHANGE;

  constructor(public payload: string) {}
}

export type BallotAction = InitializeBallotAction|SelectionAddedAction|SelectionRemovedAction|SelectionsReordereddAction|ActionTypeChangedAction;


function initializeBallotState(poll: Poll, extantVote: Vote|null): BallotState {

  let options: BallotOption[],
    numSelected: number;

  if (!extantVote) {
    options = shuffle(poll.options).map((opt, idx) => Object.assign({}, opt, {
        unselectedIndex: idx,
        selectedIndex: -1
      })
    );
    numSelected = 0;
  } else {
    //TODO
    options = shuffle(poll.options).map((opt, idx) => Object.assign({}, opt, {
      unselectedIndex: idx,
      selectedIndex: extantVote.choices.indexOf(opt.id)
    }));
    numSelected = extantVote.choices.length;
  }

  return {
    numSelected,
    ids: options.map(opt => opt.id),
    options: options.reduce((result, next) => Object.assign(result, { [next.id]: next }), {}),
    lastAction: 'click'
  };

}

function reorder(current: number[], fromIndex: number, toIndex: number): number[] {

  let ret = current.map(idx => {
    if (fromIndex > toIndex) {
      //the item was moved up the ballot
      if (idx < toIndex || idx > fromIndex) {
        //this element is outside the affected range
        return idx;
      } else if (idx == fromIndex) {
        //this is the moved element
        return toIndex;
      } else {
        // toIndex <= idx < fromIndex, i.e. it's in the range of elements that slide down one index
        return idx + 1;
      }
    } else {
      //the item was moved down the ballot
      if (idx > toIndex || idx < fromIndex) {
        //this element is outside the affected range
        return idx;
      } else if (idx == fromIndex) {
        //this is the element that was moved
        return toIndex;
      } else {
        // fromIndex < idx <= toIndex, i.e. it's in the range of elements that slide up one index
        return idx - 1;
      }
    }

  });

  return ret;
}

const initialState: BallotState = {
  options: {},
  numSelected: 0,
  ids: [],
  lastAction: 'click'
};

export function ballot(state: BallotState = initialState, action: BallotAction): BallotState {
  let opt: BallotOption, updatedOptions: { [id: string]: BallotOption };
  switch (action.type) {
    case BallotActions.INITIALIZE:

      return initializeBallotState((action as InitializeBallotAction).payload.poll, (action as InitializeBallotAction).payload.vote);

    case BallotActions.SELECTION_ADDED:
      opt = (action as SelectionAddedAction).payload;
      updatedOptions = Object.assign({}, state.options, { [opt.id]: Object.assign({}, opt, { selectedIndex: state.numSelected }) });
      return {
        ids: state.ids,
        options: updatedOptions,
        numSelected: state.numSelected + 1,
        lastAction: state.lastAction
      };

    case BallotActions.SELECTION_REMOVED:
      opt = (action as SelectionAddedAction).payload;
      let removingIndex = opt.selectedIndex;

      updatedOptions = state.ids.reduce((result, id) => {
        let currVal = state.options[ id ];
        let newVal;
        if (currVal.id == opt.id) {
          newVal = Object.assign({}, currVal, { selectedIndex: -1 });
        } else if (currVal.selectedIndex > removingIndex) {
          newVal = Object.assign({}, currVal, { selectedIndex: currVal.selectedIndex - 1 });
        } else {
          newVal = Object.assign({}, currVal);
        }
        return Object.assign(result, { [id]: newVal });
      }, {});

      return {
        ids: state.ids,
        options: updatedOptions,
        numSelected: state.numSelected - 1,
        lastAction: state.lastAction
      };


    case BallotActions.SELECTIONS_REORDERED:
      let swap = (action as SelectionsReordereddAction).payload;
      let fromIndex = swap.fromIndex,
        toIndex;
      //if the user drags an option into the null slots, correct it by changing the target to the lowest non-null
      if (swap.toIndex > state.numSelected - 1) {
        toIndex = state.numSelected - 1;
      } else {
        toIndex = swap.toIndex
      }


      let currIndices = values(state.options).filter(opt => opt.selectedIndex >= 0).map(opt => opt.selectedIndex).sort(),
        newIndices = reorder(currIndices, fromIndex, toIndex),
        newOptions = state.ids.reduce((result, id) => {
          let curr = state.options[ id ];
          return Object.assign(result, { [id]: curr.selectedIndex < 0 ? curr : Object.assign({}, curr, { selectedIndex: newIndices[ curr.selectedIndex ] }) });
        }, {});

      return {
        ids: state.ids,
        options: newOptions,
        numSelected: state.numSelected,
        lastAction: state.lastAction
      };

    case BallotActions.ACTION_TYPE_CHANGE:
      return Object.assign({}, state, { lastAction: action.payload });

    default:
      return state;
  }

}
