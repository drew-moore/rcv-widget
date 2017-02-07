import {NgModule, Optional, SkipSelf} from "@angular/core";
import {AuthService} from "./auth.service";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth.effects";

@NgModule({
  imports: [ EffectsModule.run(AuthEffects) ],
  providers: [ AuthService ]
})
export class AuthServicesModule {

  constructor(@Optional() @SkipSelf() parentModule: AuthServicesModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load AuthServicesModule more than once.');
    }
  }
}
