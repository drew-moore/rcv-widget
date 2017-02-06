import {NgModule} from "@angular/core";
import {ResultsContainerComponent} from "./results-container.component";
import {ResultsViewComponent} from "./view/results-view.component";
import {SharedModule} from "../shared/shared.module";
import {BarComponent} from "./view/bar/bar.component";
import {SegmentComponent} from "./view/segment/segment.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  declarations: [ ResultsContainerComponent, ResultsViewComponent, BarComponent, SegmentComponent ]
})
export class ResultsModule {
}
