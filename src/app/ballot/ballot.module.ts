import {NgModule} from "@angular/core";
import {BallotContainerComponent} from "./ballot-container.component";
import {BallotViewComponent} from "./view/ballot-view.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ BallotContainerComponent, BallotViewComponent ]
})
export class BallotModule {
}
