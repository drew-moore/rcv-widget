import {NgModule, SkipSelf, Optional} from "@angular/core";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";

@NgModule({
  imports: [
    InfrastructureModule
  ],
  declarations: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load CoreModule more than once.');
    }
  }


}
