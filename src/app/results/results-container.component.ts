import {Component, OnInit, trigger, state, style, animate, transition} from "@angular/core";
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
import {PollService} from "../core/poll/poll.service";
import {VoteService} from "../core/vote/vote.service";

@Component({
  selector: 'rcv-results-container',
  template: `
    <div class="outcome-bar-wrapper" [class.small]="showWalkthrough">
        <div class="inner" *ngIf="!!(poll$ | async) && !!(state$ | async)" >
          <rcv-outcome-bar [poll]="poll$ | async" [outcome]="(state$ | async).outcome" [minimize]="showWalkthrough"></rcv-outcome-bar>
          <button md-raised-button (click)="toggleWalkthrough()" *ngIf="!showWalkthrough" class="show-details-btn" [@showDetailsBtn]>show details</button>
        </div>
    </div>
    <rcv-walkthrough *ngIf="showWalkthrough && (!!(poll$ | async) && !!(state$ | async))" [@walkthrough]
      class="walkthrough-wrapper"
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
    ></rcv-walkthrough>
  `,
  styleUrls: [ './results-container.component.scss' ],
  animations: [
    trigger('walkthrough', [
      state('void', style({ height: 0 })),
      state('*', style({ height: '*' })),
      transition('void <=> *', animate(250))
    ]),
    trigger('showDetailsBtn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(100px)' }),
        animate('1500ms 1250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        animate('250ms', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class ResultsContainerComponent implements OnInit {

  poll$: Observable<Poll>;
  votes$: Observable<Vote[]>;

  private data$: Observable<{ poll: Poll, votes: Vote[] }>;

  state$: Observable<ResultsState>;

  showWalkthrough: boolean;

  initialized: boolean = false;

  constructor(private pollSvc: PollService, private voteSvc: VoteService, private store: Store<AppState>) {


    this.poll$ = this.pollSvc.activePoll$;

    this.votes$ = this.voteSvc.activePollVotes$;


    /*
     let poll = mockPoll();

     this.poll$ = Observable.of(poll).share();//this.store.select(getActivePoll);

     this.votes$ = Observable.of(mockVotesForPoll(poll)).share();//this.store.select(getVotesForActivePoll);*/
    this.state$ = store.select(getResultsState);

    this.data$ = Observable.combineLatest(this.poll$, this.votes$).map(([ poll, votes ]) => ({ poll, votes })).share();


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

  toggleWalkthrough() {
    this.showWalkthrough = !this.showWalkthrough;
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
