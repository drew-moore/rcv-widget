import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BallotContainerComponent} from "../ballot/ballot-container.component";
import {ResultsContainerComponent} from "../results/results-container.component";
import {WidgetRootComponent} from "./widget-root.component";

export const WIDGET_ROUTES: Routes = [
  {
    path: ':pollId',
    component: WidgetRootComponent,
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
];

@NgModule({
  imports: [
    RouterModule.forChild(WIDGET_ROUTES)
  ],
  exports: [ RouterModule ]
})
export class WidgetRoutingModule {
}
