import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WebsiteRootComponent} from "./website-root.component";
import {SplashComponent} from "./splash/splash.component";
import {CreateContainerComponent} from "../admin/create-container.component";
import {AdminContainerComponent} from "../admin/admin-container.component";
import {EditContainerComponent} from "../admin/edit-container.component";

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: WebsiteRootComponent,
    children: [
      {
        path: 'poll/:pollId/admin',
        component: AdminContainerComponent
      },
      {
        path: 'poll/:pollId/edit',
        component: EditContainerComponent
      },
      {
        path: 'poll',
        loadChildren: 'app/widget/widget.module#WidgetModule'
      },
      {
        path: 'create',
        component: CreateContainerComponent
      },
      {
        path: '',
        component: SplashComponent
      }
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
