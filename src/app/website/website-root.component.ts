import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {Poll} from "../core/poll/poll.models";
import {Store} from "@ngrx/store";
import {AppState, getActivePoll} from "../state";

@Component({
  selector: 'rcv-website-root',
  templateUrl: 'website-root.component.html',
  styleUrls: [ 'website-root.component.scss' ]
})
export class WebsiteRootComponent implements OnInit {

  activePoll: Observable<Poll>;

  constructor(private store: Store<AppState>) {
    this.activePoll = this.store.select(getActivePoll);
    this.activePoll.subscribe(x => console.log(x));
  }

  ngOnInit() {
  }

}
