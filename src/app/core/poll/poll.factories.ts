import {PollOption, Poll} from "./poll.models";
import * as moment from "moment";


const MANDATORY_POLL_OPTION_PROPS = [ 'text', 'id', 'color' ];

const MANDATORY_POLL_PROPS = [ 'prompt', 'id', 'options', 'security', 'status', 'published', 'expires' ];

export type PollOptionFactoryOptions = { throwOnInvalid?: boolean };
export type PollFactoryOptions = { optionsFactory?: PollOptionFactoryOptions, throwOnInvalid?: boolean };


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
