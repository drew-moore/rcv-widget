import {NgModule, SkipSelf, Optional} from "@angular/core";
import {PollService} from "./poll/poll.service";
import {PollEffects} from "./poll/polls.effects";
import {VoteService} from "./vote/vote.service";
import {UserService} from "./user/user.service";
import {VoteEffects} from "./vote/votes.effects";
import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./user/user.effects";

@NgModule({
  imports: [
    EffectsModule.run(PollEffects),
    EffectsModule.run(VoteEffects),
    EffectsModule.run(UserEffects)
  ],
  providers: [ PollService, VoteService, UserService ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load CoreModule more than once.');
    }
  }

}
