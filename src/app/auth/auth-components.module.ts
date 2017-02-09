import {NgModule} from "@angular/core";
import {AuthWidgetContainerComponent} from "./auth-widget/auth-widget-container.component";
import {AuthWidgetViewComponent} from "./auth-widget/auth-widget-view.component";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthModalComponent} from "./auth-modal/auth-modal.component";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ AuthWidgetContainerComponent, AuthWidgetViewComponent, AuthModalComponent ],
  exports: [ AuthWidgetContainerComponent, AuthModalComponent ],
  entryComponents: [ AuthModalComponent ]
})
export class AuthComponentsModule {
}
