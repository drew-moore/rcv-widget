import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ResultsContainerComponent} from "./results-container.component";
import {ResultsViewComponent} from "./view/results-view.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ ResultsContainerComponent, ResultsViewComponent ]
})
export class ResultsModule {
}
