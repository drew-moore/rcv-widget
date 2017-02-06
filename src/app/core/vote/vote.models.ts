import {Moment} from "moment";
import {Entity} from "../_internal";

export interface Vote {
  /**
   * unique identifier for this vote
   */
  id: string;

  /**
   * Ordered array of the choices ranked in this vote, each represented by it's mockId
   */
  choices: string[];

  /**
   * the mockId of the voter who cast the vote. Note: If the vote was cast privately, this value will be null
   */
  owner: string;

  /**
   * whether the owner has chosen to make their vote public
   */
  published: boolean;

  /**
   * the time the vote was initially cast
   */
  cast: Moment;

}

export type RequiredVoteField = 'choices'|'published';
export type OptionalVoteField = 'id'|'owner'|'cast';
export type VoteField = RequiredVoteField|OptionalVoteField;

export type PartialVote = {
  [P in RequiredVoteField]: Vote[P] //mandatory
  } & {
  [P in OptionalVoteField]?: Vote[P] //optiona;
  }

export type VoteEntity = Entity & {
  [P in RequiredVoteField|'id'|'owner']: Vote[P]
  } & {
  cast: Moment|string
};

