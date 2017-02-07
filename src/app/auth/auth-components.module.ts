import {NgModule} from "@angular/core";
import {AuthWidgetContainerComponent} from "./auth-widget/auth-widget-container.component";
import {AuthWidgetViewComponent} from "./auth-widget/auth-widget-view.component";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ AuthWidgetContainerComponent, AuthWidgetViewComponent ],
  exports: [ AuthWidgetContainerComponent ]
})
export class AuthComponentsModule {
}
