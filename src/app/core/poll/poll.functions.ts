import * as moment from "moment";
import {sortBy, keys} from "lodash";
import {
  PollOption,
  Poll,
  PollField,
  RequiredPollField,
  OptionalPollField,
  RequiredPollOptionField,
  OptionalPollOptionField,
  PollOptionField,
  PollEntity
} from "./poll.models";


export const REQUIRED_POLL_OPTION_FIELDS: RequiredPollOptionField[] = [ 'text', 'color' ];
export const OPTIONAL_POLL_OPTION_FIELDS: OptionalPollOptionField[] = [ 'id', 'image' ];
export const POLL_OPTION_FIELDS: PollOptionField[] = [ ...REQUIRED_POLL_OPTION_FIELDS, ...OPTIONAL_POLL_OPTION_FIELDS ];


export const REQUIRED_POLL_FIELDS: RequiredPollField[] = [ 'prompt', 'security', 'published', 'expires', 'status' ];
export const OPTIONAL_POLL_FIELDS: OptionalPollField[] = [ 'id', 'created', 'owner', 'expiration' ];
export const POLL_FIELDS: PollField[] = [ ...REQUIRED_POLL_FIELDS, ...OPTIONAL_POLL_FIELDS ];


export type PollOptionFactoryOptions = { throwOnInvalid?: boolean };
export type PollFactoryOptions = { optionsFactory?: PollOptionFactoryOptions, throwOnInvalid?: boolean };


export function pollOption(input: any, options: PollOptionFactoryOptions = {}): PollOption {

  REQUIRED_POLL_OPTION_FIELDS.forEach(prop => {
    if (input[ prop ] == undefined) {
      if (options && options.throwOnInvalid) {
        throw `Mandatory property ${prop} missing on PollOption input value: ${JSON.stringify(input)}`;
      }
      else {
        throw `Mandatory property ${prop} missing on PollOption input value: ${JSON.stringify(input)}`;
      }
    }
  });

  return {
    id: input.id,
    text: input.text,
    color: input.color,
    image: input.image || null
  }
}



export function poll(input: any, options: PollFactoryOptions = {}): Poll {

  REQUIRED_POLL_FIELDS.forEach(prop => {
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
    security: input.security,
    published: input.published,
    owner: input.owner,
    created: moment(input.created),

    expires: input.expires,
    expiration: !!input.expiration ? moment(input.expiration) : undefined,

    options: input.options.map((data: any) => pollOption(data, options.optionsFactory)),

    status: input.status || 'open'
  }
}

export function pollForEntity(it: PollEntity): Poll|undefined {
  if (!it.$exists()) {
    return undefined;
  }

  let opts = keys(it.options).map(id => Object.assign({}, it.options[ id ], { id }));

  return poll(Object.assign({}, it, { id: it.$key, options: opts }));
}




export function pollsEqual(x: Poll, y: Poll) {
  if ((!x && !!y) || (!!x && !y)) {
    //exactly one is undefined
    return false;
  }

  if (!(!!x || !!y)) {
    //both are undefined
    return true;
  }

  //neither are undefined:

  for (let i = 0; i < POLL_FIELDS.length; i++) {
    if (x[ POLL_FIELDS[ i ] ] !== y[ POLL_FIELDS[ i ] ]) {
      return false;
    }
  }

  if (x.options.length != y.options.length) {
    return false;
  }

  let xOpts = sortBy(x.options, 'id'),
    yOpts = sortBy(y.options, 'id');

  for (let i = 0; i < xOpts.length; i++) {
    for (let j = 0; j < POLL_OPTION_FIELDS.length; j++) {
      if (xOpts[ i ][ POLL_OPTION_FIELDS[ j ] ] != yOpts[ i ][ POLL_OPTION_FIELDS[ j ] ]) {
        return false;
      }
    }
  }

  return true;
}




