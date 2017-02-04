import {Vote} from "./vote.models";
import * as moment from "moment";

/************************ Vote **************************/
const MANDATORY_VOTE_PROPS = [ 'choices', 'id' ];
export type VoteFactoryOptions = {
  /** if present, each choice will be checked to ensure it matches an element in the given array */
  validateChoices?: string[],
  throwOnInvalid?: boolean
};
export function vote(input: any, options: VoteFactoryOptions = {}): Vote {
  MANDATORY_VOTE_PROPS.forEach(prop => {
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
