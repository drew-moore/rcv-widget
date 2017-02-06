/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {PollService} from "./poll.service";

describe('VoteEffects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PollService ]
    });
  });

  it('should ...', inject([ PollService ], (service: PollService) => {
    expect(service).toBeTruthy();
  }));
});
