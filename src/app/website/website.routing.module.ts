import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BallotContainerComponent} from "../ballot/ballot-container.component";
import {ResultsContainerComponent} from "../results/results-container.component";
import {WebsiteRootComponent} from "./website-root.component";

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: WebsiteRootComponent,
    children: [
      {
        path: 'poll/:pollId',

        children: [
          {
            path: 'ballot',
            component: BallotContainerComponent
          }, {
            path: 'results',
            component: ResultsContainerComponent
          },
          {
            path: '',
            redirectTo: 'ballot',
            pathMatch: 'full'
          }
        ]
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
