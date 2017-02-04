import {shuffle} from "lodash";
import {mockPoll} from "../fixtures";
import {pollsEqual, POLL_FIELDS} from "./poll.functions";


describe('poll functions', () => {


  describe('pollsEqual()', () => {


    it('should return false if the inputs have different values for any poll field', () => {

      let field = shuffle(POLL_FIELDS)[ 0 ];

      let x = mockPoll(), y = Object.assign({}, x, { [field]: 'foobarbazoo' });

      expect(pollsEqual(x, y)).toBeFalsy();

    });

    it('should return true for different references to identical objects', () => {
      let x = mockPoll(), copy = Object.assign({}, x);

      expect(pollsEqual(x, copy)).toBeTruthy();

    });


  });


});
