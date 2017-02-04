import {NgModule, SkipSelf, Optional} from "@angular/core";
import {PollService} from "./poll/poll.service";

@NgModule({
  imports: [],
  providers: [ PollService ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load CoreModule more than once.');
    }
  }


}
