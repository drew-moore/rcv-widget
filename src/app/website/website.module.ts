import {NgModule} from "@angular/core";
import {WebsiteRootComponent} from "./website-root.component";
import {SharedModule} from "../shared/shared.module";
import {WebsiteRoutingModule} from "./website.routing.module";
import {WidgetModule} from "../widget/widget.module";

@NgModule({
  imports: [
    WebsiteRoutingModule,
    SharedModule,
    WidgetModule
  ],
  declarations: [ WebsiteRootComponent ]
})
export class WebsiteModule {
}
