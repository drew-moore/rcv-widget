import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {CoreModule} from "./core/core.module";
import {RouterModule} from "@angular/router";
import {AppInfrastructureModule} from "./app.infrastructure.module";

export const APP_ROUTES = [
  {
    path: 'embed',
    loadChildren: 'app/widget/widget.module#WidgetModule'
  }
  , {
    path: '',
    loadChildren: 'app/website/website.module#WebsiteModule'
  }
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    RouterModule.forRoot(APP_ROUTES),

    AppInfrastructureModule,

    CoreModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
