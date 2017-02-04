import {NgModule, SkipSelf, Optional} from "@angular/core";
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";


@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.conf.firebase),
  ],
  exports: [
    AngularFireModule
  ]
})
export class AppInfrastructureModule {

  constructor(@Optional() @SkipSelf() parentModule: AppInfrastructureModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load Infrastructure more than once.');
    }
  }


}
