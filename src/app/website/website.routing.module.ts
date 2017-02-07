import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WebsiteRootComponent} from "./website-root.component";
import {SplashComponent} from "./splash/splash.component";

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: WebsiteRootComponent,
    children: [
      {
        path: 'poll',
        loadChildren: 'app/widget/widget.module#WidgetModule'
      },
      {
        path: '',
        component: SplashComponent
      }
      //will contain routes to create, admin and other components in modules not included in widget
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(WEBSITE_ROUTES)
  ],
  exports: [ RouterModule ]
})
export class WebsiteRoutingModule {
}
