import {NgModule} from "@angular/core";
import {WebsiteRootComponent} from "./website-root.component";
import {SharedModule} from "../shared/shared.module";
import {WebsiteRoutingModule} from "./website.routing.module";
import {ResultsModule} from "../results/results.module";
import {BallotModule} from "../ballot/ballot.module";

@NgModule({
  imports: [
    WebsiteRoutingModule,
    SharedModule,
    ResultsModule,
    BallotModule
  ],
  declarations: [ WebsiteRootComponent ]
})
export class WebsiteModule {
}
