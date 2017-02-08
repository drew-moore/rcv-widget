import {NgModule} from "@angular/core";
import {ResultsContainerComponent} from "./results-container.component";
import {WalkthroughComponent} from "./view/walkthrough/walkthrough.component";
import {SharedModule} from "../shared/shared.module";
import {BarComponent} from "./view/walkthrough/bar/bar.component";
import {SegmentComponent} from "./view/walkthrough/segment/segment.component";
import {FormsModule} from "@angular/forms";
import {OutcomeBarComponent} from "./view/outcome-bar/outcome-bar.component";

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  declarations: [ ResultsContainerComponent, WalkthroughComponent, BarComponent, SegmentComponent, OutcomeBarComponent ]
})
export class ResultsModule {
}
