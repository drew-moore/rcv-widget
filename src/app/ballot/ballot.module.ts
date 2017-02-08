import {NgModule} from "@angular/core";
import {SortablejsModule} from "angular-sortablejs";
import {BallotViewComponent} from "./view/ballot-view.component";
import {SharedModule} from "../shared/shared.module";
import {BallotContainerComponent} from "./ballot-container.component";
import {SlotComponent} from "./view/slot/slot.component";
import {OrderSlotsPipe} from "./view/order-slots.pipe";
import {AuthComponentsModule} from "../auth/auth-components.module";
import {BallotMobileComponent} from "./view/mobile-view/ballot-mobile.component";

@NgModule({
  imports: [
    SharedModule,
    SortablejsModule,
    AuthComponentsModule
  ],
  declarations: [ BallotContainerComponent, BallotViewComponent, SlotComponent, OrderSlotsPipe, BallotMobileComponent ]
})
export class BallotModule {
}
