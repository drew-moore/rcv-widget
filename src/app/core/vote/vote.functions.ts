import {Vote, RequiredVoteField, OptionalVoteField, VoteField} from "./vote.models";
import * as moment from "moment";

/************************ Vote **************************/
const REQUIRED_VOTE_FIELDS: RequiredVoteField[] = [ 'choices', 'published' ];
const OPTIONAL_VOTE_FIELDS: OptionalVoteField[] = [ 'id', 'owner', 'cast' ];
const VOTE_FIELDS: VoteField[] = [ ...REQUIRED_VOTE_FIELDS, ...OPTIONAL_VOTE_FIELDS ];


export type VoteFactoryOptions = {
  /** if present, each choice will be checked to ensure it matches an element in the given array */
  validateChoices?: string[],
  throwOnInvalid?: boolean
};
export function vote(input: any, options: VoteFactoryOptions = {}): Vote {
  REQUIRED_VOTE_FIELDS.forEach(prop => {
    if (input[ prop ] == undefined) {
      if (options && options.throwOnInvalid) {
        throw `Mandatory property ${prop} missing on Vote input value: ${JSON.stringify(input)}`;
      }
      else {
        throw `Mandatory property ${prop} missing on Vote input value: ${JSON.stringify(input)}`;
      }
    }
  });


  return {
    id: input.id,
    choices: input.choices,
    cast: moment(input.cast),
    published: input.published,
    owner: input.owner
  }
}

export function votesEqual(x: Vote, y: Vote) {
  if ((!x && !!y) || (!!x && !y)) {
    return false;
  }

  if (!(!!x || !!y)) {
    //both are undefined
    return true;
  }

  for (let i = 0; i < VOTE_FIELDS.length; i++) {
    if (x[ VOTE_FIELDS[ i ] ] != y[ VOTE_FIELDS[ i ] ]) {
      return false;
    }
  }

  return true;

}
