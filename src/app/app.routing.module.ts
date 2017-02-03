import {BallotContainerComponent} from "./ballot/ballot-container.component";
import {ResultsContainerComponent} from "./results/results-container.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
export const APP_ROUTES = [
  {
    path: 'embed/:pollId',

    children: [
      {
        path: 'ballot',
        component: BallotContainerComponent
      }, {
        path: 'results',
        component: ResultsContainerComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
