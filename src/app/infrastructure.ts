import {NgModule, SkipSelf, Optional} from "@angular/core";
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";
import {AuthServicesModule} from "./auth/auth-services.module";


@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.conf.firebase),
    AuthServicesModule
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
