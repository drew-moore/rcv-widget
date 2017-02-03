import {NgModule} from "@angular/core";
import {ResultsContainerComponent} from "./results-container.component";
import {ResultsViewComponent} from "./view/results-view.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ ResultsContainerComponent, ResultsViewComponent ]
})
export class ResultsModule {
}
