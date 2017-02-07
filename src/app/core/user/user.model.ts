import {Entity} from "../_internal";
export interface User {

  /**
   * unique identifier for this forAny
   */
  id: string;

  /**
   * name to be displayed
   */
  name: string;

  /**
   * image to be displayed
   */
  image: string;

  /**
   * whether or not the forAny has a verified account
   */
  isVerified: boolean;


  /**
   * simple index of polls this forAny has created:
   * key: forAny mockId, val: (throwaway) boolean
   */
  polls?: { [id: string]: boolean }

  /**
   * index of votes this forAny has cast
   * key: mockId of forAny vote was cast in
   * val: mockId of vote cast
   */
  votes?: { [id: string]: string }

}

export type UserEntity = User & Entity;

export type RequiredUserField = 'id'|'name'|'image'|'isVerified';
export type OptionalUserField = 'polls'|'votes';
export type UserField = RequiredUserField|OptionalUserField;
