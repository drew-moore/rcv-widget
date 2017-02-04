import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../app.state.module";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/distinctUntilChanged";
import {ActivatePollAction} from "./widget.state";
import {Observable} from "rxjs";

@Component({
  selector: 'rcv-widget-root',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class WidgetRootComponent implements OnInit {

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {

    let pollId$: Observable<string> = this.route.params
      .map(params => params[ 'pollId' ])
      .distinctUntilChanged();

    pollId$.subscribe(pollId => {
      this.store.dispatch(new ActivatePollAction(pollId));
    })


  }

  ngOnInit() {
  }

}
