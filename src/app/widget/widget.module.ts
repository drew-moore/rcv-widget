import {NgModule} from "@angular/core";
import {ResultsModule} from "../results/results.module";
import {BallotModule} from "../ballot/ballot.module";
import {WidgetRoutingModule} from "./widget.routing.module";
import {WidgetRootComponent} from "./widget-root.component";

@NgModule({
  imports: [
    WidgetRoutingModule,
    BallotModule,
    ResultsModule
  ],
  declarations: [ WidgetRootComponent ]
})
export class WidgetModule {
}
