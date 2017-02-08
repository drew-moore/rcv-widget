import {NgModule} from "@angular/core";
import {WebsiteRootComponent} from "./website-root.component";
import {SharedModule} from "../shared/shared.module";
import {WebsiteRoutingModule} from "./website.routing.module";
import {WidgetModule} from "../widget/widget.module";
import {SplashComponent} from "./splash/splash.component";
import {AuthComponentsModule} from "../auth/auth-components.module";
import {IsWebsite} from "../index";

@NgModule({
  imports: [
    WebsiteRoutingModule,
    SharedModule,
    WidgetModule,
    AuthComponentsModule
  ],
  declarations: [ WebsiteRootComponent, SplashComponent ],
  providers: [
    { provide: IsWebsite, useValue: true }
  ]
})
export class WebsiteModule {
}
