import {NgModule, SkipSelf, Optional} from "@angular/core";
import {PollService} from "./poll/poll.service";
import {PollEffects} from "./poll/polls.effects";
import {VoteService} from "./vote/vote.service";

@NgModule({
  imports: [],
  providers: [ PollService, PollEffects, VoteService ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load CoreModule more than once.');
    }
  }

}
