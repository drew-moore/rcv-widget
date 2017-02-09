import {NgModule} from "@angular/core";
import {WebsiteRootComponent} from "./website-root.component";
import {SharedModule} from "../shared/shared.module";
import {WebsiteRoutingModule} from "./website.routing.module";
import {WidgetModule} from "../widget/widget.module";
import {SplashComponent} from "./splash/splash.component";
import {AuthComponentsModule} from "../auth/auth-components.module";
import {IsWebsite} from "../index";
import {AdminModule} from "../admin/admin.module";

@NgModule({
  imports: [
    SharedModule,
    WebsiteRoutingModule,

    AuthComponentsModule,
    WidgetModule,
    AdminModule
  ],
  declarations: [ WebsiteRootComponent, SplashComponent ],
  providers: [
    { provide: IsWebsite, useValue: true }
  ]
})
export class WebsiteModule {
}
