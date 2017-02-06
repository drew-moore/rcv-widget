import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState, getResultsState} from "../state";
import {Observable} from "rxjs";
import {Poll} from "../core/poll/poll.models";
import {Vote} from "../core/vote/vote.models";
import {
  InitializeResultsAction,
  NextRoundAction,
  PrevRoundAction,
  BarHoveredAction,
  SegmentHoveredAction,
  RemoveOptionAction,
  UnremoveOptionAction,
  RestartAction
} from "./results.reducer";
import {ResultsState} from "./results.models";
import {mockPoll, mockVotesForPoll} from "../core/fixtures";

@Component({
  selector: 'rcv-results-container',
  template: `
    <rcv-results-view *ngIf="!!(poll$ | async) && !!(state$ | async)"
      [poll]="poll$ | async" 
      [state]="state$ | async" 
      [initialized]="initialized"
      (nextRound)="nextRound()"
      (prevRound)="prevRound()"
      (reset)="reset()"
      (barHover)="barHover($event)"
      (segmentHover)="segmentHover($event)"
      (remove)="removeOption($event)"
      (unremove)="unremoveOption($event)"
    ></rcv-results-view>
  `,
  styles: []
})
export class ResultsContainerComponent implements OnInit {

  poll$: Observable<Poll>;
  votes$: Observable<Vote[]>;

  private data$: Observable<{ poll: Poll, votes: Vote[] }>;

  state$: Observable<ResultsState>;

  initialized: boolean = false;

  constructor(private store: Store<AppState>) {

    /*

     this.poll$ = this.store.select(getActivePoll);

     this.votes$ = this.store.select(getVotesForActivePoll);

     */

    let poll = mockPoll();

    this.poll$ = Observable.of(poll).share();//this.store.select(getActivePoll);

    this.votes$ = Observable.of(mockVotesForPoll(poll)).share();//this.store.select(getVotesForActivePoll);

    this.data$ = Observable.combineLatest(this.poll$, this.votes$).map(([ poll, votes ]) => ({ poll, votes })).share();

    this.state$ = this.store.select(getResultsState);

    this.poll$.subscribe(x => {
      console.log('poll');
      console.log(x);
    });


    this.votes$.subscribe(x => {
      console.log('votes');
      console.log(x);
    });

    Observable.combineLatest(this.poll$, this.votes$)
      .filter(([ poll, votes ]) => !!poll && votes.length > 0)
      .subscribe(([ poll, votes ]) => {
        this.store.dispatch(new InitializeResultsAction(poll.options, votes));
      });

  }

  ngOnInit() {

    setTimeout(() => {
      this.initialized = true;
    }, 1000);

  }

  nextRound() {
    this.store.dispatch(new NextRoundAction());
  }

  prevRound() {
    this.store.dispatch(new PrevRoundAction());
  }

  barHover(info: { barId: string, value: boolean }) {
    this.store.dispatch(new BarHoveredAction(info.barId, info.value));
  }

  segmentHover(info: { barId: string, segmentId: string, value: boolean }) {
    console.log('herd');
    this.store.dispatch(new SegmentHoveredAction(info.barId, info.segmentId, info.value));
  }

  removeOption(id: string) {
    this.data$.take(1).subscribe(data => {
      this.store.dispatch(new RemoveOptionAction(id, data.poll.options, data.votes));
    });
  }

  unremoveOption(id: string) {
    this.data$.take(1).subscribe(data => {
      this.store.dispatch(new UnremoveOptionAction(id, data.poll.options, data.votes));
    });
  }

  reset() {
    this.store.dispatch(new RestartAction());
  }
}
