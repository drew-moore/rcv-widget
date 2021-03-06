import * as moment from "moment";
import {Entity} from "../_internal";
import Moment = moment.Moment;

/**
 * TODO document what each type specifies
 */
export type SecurityLevel = 'anonymous' | 'unverified' | 'verified' | 'private';


/**
 * a candidate choice - one of the options being ranked - in a poll
 */
export interface PollOption {
  /**
   * unique identifier for this object
   */
  id: string;

  /**
   * the name or brief definition of this option
   */
  text: string;

  /**
   * the color of the swatch used to represent this option in the UI
   */
  color: string;

  /**
   * optionally, an image can be used in place of the color
   */
  image?: string;
}


export interface Poll {
  /**
   * unique identifier for this poll
   */
  id: string;

  /**
   * the question the poll is asking
   */
  prompt: string;

  /**
   * the options being ranked in this poll
   */
  options: PollOption[];

  /**
   * the poll's security setting
   */
  security: SecurityLevel;

  /**
   * when the poll was created (for sorting purposes)
   */
  created: Moment;

  /**
   * whether the poll should be shown on the homepage feed
   */
  published: boolean;

  /**
   * whether or not the poll is set to end at a finite date.
   * if true,
   */
  expires: boolean;


  status: 'open'|'closed';

  /**
   * the datetime at which the poll will expire
   * (optional) moment at which the poll should be automatically closed
   */
  expiration?: Moment;

  /**
   * the mockId of the auth who created this poll
   */
  owner: string;
}

export type RequiredPollField = 'prompt'|'security'|'published'|'expires'|'status';
export type OptionalPollField = 'id'|'created'|'owner'|'expiration';
export type PollField = RequiredPollField|OptionalPollField;

export type RequiredPollOptionField = 'text'|'color';
export type OptionalPollOptionField = 'id'|'image';
export type PollOptionField = RequiredPollOptionField|OptionalPollOptionField;


export type PartialPollOption =
  {[P in OptionalPollOptionField]?: PollOption[P]} &
    {[P in RequiredPollOptionField]: PollOption[P]
      };

//Serializable___ means: stripped of any undefined fields (always), and typically stripped of id properties that are not directly persisted as such

export type SerializablePollOption = {
  [P in 'text'|'color']: PollOption[P]
  } &  {
  image?: string;
} // note NO mention of id.


export type PartialPoll =
  { [P in OptionalPollField]?: Poll[P]} &  //optional props
    { [P in  RequiredPollField]: Poll[P]} &  //mandatory
    { options: PartialPollOption[] }; // instead of

export type SerializablePoll = {
  [P in RequiredPollField|'owner']: Poll[P]
  } & {
  created: string,
  expiration?: string
} & {
  options: { [id: string]: SerializablePollOption }
}

export type PollEntity = SerializablePoll & Entity;
