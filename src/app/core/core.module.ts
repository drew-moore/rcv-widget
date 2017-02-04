import {NgModule, SkipSelf, Optional} from "@angular/core";

@NgModule({

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
