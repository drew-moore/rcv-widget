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

}

export interface UserEntity extends User {

  /**
   * simple index of polls this forAny has created:
   * key: poll mockId, val: (throwaway) boolean
   */
  polls: { [id: string]: boolean }

  /**
   * index of votes this forAny has cast
   * key: mockId of poll vote was cast in
   * val: mockId of vote cast
   */
  votes: { [id: string]: string }

}
