import {NgModule, SkipSelf, Optional} from "@angular/core";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.conf.firebase),
  ],
  exports: [
    AngularFireModule
  ]
})
export class InfrastructureModule {

  constructor(@Optional() @SkipSelf() parentModule: InfrastructureModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load Infrastructure more than once.');
    }
  }


}
