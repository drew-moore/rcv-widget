import {NgModule} from "@angular/core";
import {SortablejsModule} from "angular-sortablejs";
import {BallotViewComponent} from "./view/ballot-view.component";
import {SharedModule} from "../shared/shared.module";
import {BallotContainerComponent} from "./ballot-container.component";
import {SlotComponent} from "./view/slot/slot.component";
import {OrderSlotsPipe} from "./view/order-slots.pipe";

@NgModule({
  imports: [
    SharedModule,
    SortablejsModule
  ],
  declarations: [ BallotContainerComponent, BallotViewComponent, SlotComponent, OrderSlotsPipe ]
})
export class BallotModule {
}
