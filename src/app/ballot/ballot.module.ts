import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BallotContainerComponent} from "./ballot-container.component";
import {BallotViewComponent} from "./view/ballot-view.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BallotContainerComponent, BallotViewComponent ]
})
export class BallotModule {
}
