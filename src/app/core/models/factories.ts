import {Poll, PollOption} from "./poll";
import * as moment from "moment";
import {Vote} from "./vote";


/************************ PollOption **************************/

const MANDATORY_POLL_OPTION_PROPS = [ 'text', 'id', 'color' ];
export type PollOptionFactoryOptions = { throwOnInvalid?: boolean };

export function pollOption(input: any, options: PollOptionFactoryOptions = {}): PollOption {

  MANDATORY_POLL_OPTION_PROPS.forEach(prop => {
    if (options && options.throwOnInvalid) {
      throw `Mandatory property ${prop} missing on PollOption input value: ${JSON.stringify(input)}`;
    }
    else {
      throw `Mandatory property ${prop} missing on PollOption input value: ${JSON.stringify(input)}`;
    }
  });

  return {
    id: input.id,
    text: input.text,
    color: input.color,
    image: input.image || null
  }
}


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


/*********************** Poll **************************/

const MANDATORY_POLL_PROPS = [ 'prompt', 'id', 'options' ];
export type PollFactoryOptions = { optionsFactory?: PollOptionFactoryOptions, votesFactory?: VoteFactoryOptions, throwOnInvalid?: boolean };
const PollDefaults = { security: 'unverified', published: true, ephemeral: false, };

export function poll(input: any, options: PollFactoryOptions = {}): Poll {

  MANDATORY_POLL_PROPS.forEach(prop => {
    if (input[ prop ] == undefined) {
      if (options && options.throwOnInvalid) {
        throw `Mandatory property ${prop} missing on Poll input value: ${JSON.stringify(input)}`;
      }
      else {
        console.warn(`Mandatory property ${prop} missing on Poll input value: ${JSON.stringify(input)}`);
      }
    }
  });

  if (input.expires && !input.expiration) {
    throw `Poll is marked as ephemeral but has no expiration: ${JSON.stringify(input)}`;
  }


  return {
    id: input.id as string,
    prompt: input.prompt,
    security: input.security || PollDefaults.security,
    published: input.published || PollDefaults.published,
    owner: input.owner,
    created: moment(input.created),

    expires: input.expires || PollDefaults.ephemeral,
    expiration: !!input.expiration ? moment(input.expiration) : undefined,

    options: input.options.map((data: any) => pollOption(data, options.optionsFactory)),

    status: input.status || 'open'
  }
}


/************************ User **************************/

export function user(it: any) {

}
