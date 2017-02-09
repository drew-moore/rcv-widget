import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {AppState} from "../state";
import {Observable} from "rxjs";
import {ActivatePollAction} from "../widget/widget.state";
import {Poll} from "../core/poll/poll.models";
import {Vote} from "../core/vote/vote.models";
import {PollService} from "../core/poll/poll.service";
import {VoteService} from "../core/vote/vote.service";

@Component({
  selector: 'rcv-admin-container',
  template: `<rcv-admin-view [poll]="poll$ | async" [votes]="votes$ | async" *ngIf="!!(poll$ | async) && !!(votes$ | async)" (gotoEdit)="gotoEdit()"></rcv-admin-view>`,
  styles: []
})
export class AdminContainerComponent implements OnInit {

  poll$: Observable<Poll>;
  votes$: Observable<Vote[]>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private pollSvc: PollService, private voteSvc: VoteService, private router: Router) {

    let pollId$: Observable<string> = this.route.params
      .map(params => params[ 'pollId' ])
      .distinctUntilChanged();

    pollId$.subscribe(pollId => {
      this.store.dispatch(new ActivatePollAction(pollId));
    });

    this.poll$ = this.pollSvc.activePoll$;

    this.votes$ = this.voteSvc.activePollVotes$;

  }

  gotoEdit() {
    this.router.navigate([ '../edit' ], { relativeTo: this.route });
  }


  ngOnInit() {
  }

}
