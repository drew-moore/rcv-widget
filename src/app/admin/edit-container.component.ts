import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {PollService} from "../core/poll/poll.service";
import {VoteService} from "../core/vote/vote.service";
import {ActivatePollAction} from "../widget/widget.state";
import {Observable} from "rxjs";
import {AppState} from "../state";
import {Poll} from "../core/poll/poll.models";

@Component({
  selector: 'rcv-edit-container',
  template: `<rcv-editor-view [poll]="poll$ | async"></rcv-editor-view>`,
  styles: []
})
export class EditContainerComponent implements OnInit {

  poll$: Observable<Poll>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private pollSvc: PollService, private voteSvc: VoteService) {

    let pollId$: Observable<string> = this.route.params
      .map(params => params[ 'pollId' ])
      .distinctUntilChanged();

    pollId$.subscribe(pollId => {
      this.store.dispatch(new ActivatePollAction(pollId));
    });

    this.poll$ = this.pollSvc.activePoll$;

  }

  ngOnInit() {
  }

}
