import {Component, OnInit, trigger, transition, style, animate, Inject} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {values} from "lodash";
import {Poll} from "../core/poll/poll.models";
import {
  BallotState,
  InitializeBallotAction,
  BallotOption,
  SelectionAddedAction,
  SelectionsReordereddAction,
  SelectionRemovedAction,
  ActionTypeChangedAction
} from "./ballot.state";
import {ActivatedRoute, Router} from "@angular/router";
import {PollService} from "../core/poll/poll.service";
import {Store} from "@ngrx/store";
import {VoteService} from "../core/vote/vote.service";
import {PartialVote} from "../core/vote/vote.models";
import {MediaMonitor, MatchMedia, BreakPointRegistry} from "@angular/flex-layout";
import {getBallotState} from "../state";

@Component({
  selector: 'rcv-ballot-container',
  template: `<rcv-ballot-view [state]="state$ | async" 
                           [poll]="poll | async" 
                           (selectionAdded)="addSelection($event)" 
                           (selectionsReordered)="reorderSelections($event)" 
                           (cast)="castBallot($event)" 
                           (selectionRemoved)="removeSelection($event)"
                           (actionTypeChange)="actionTypeChanged($event)"
                           *ngIf="!(showMobileLayout$ | async)"
                           >       
            </rcv-ballot-view>
<!--          <rcv-ballot-mobile [state]="state$ | async" 
                             [poll]="poll | async" 
                             [options]="options | async"
                             (selectionAdded)="addSelection($event)" 
                             (selectionsReordered)="reorderSelections($event)" 
                             (cast)="castBallot($event)" 
                             (selectionRemoved)="removeSelection($event)"
                              *ngIf="(showMobileLayout$ | async)"
                             >
          </rcv-ballot-mobile>-->

`,
  styles: [
    `:host{
      display: block; 
      height: 100%;     
     }

` ],
  host: { '[@fade]': '' },
  animations: [
    trigger('fade', [
      transition(':leave', [
        style({ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }),
        animate('500ms ease-in', style({ opacity: 0 }))
      ]),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BallotContainerComponent implements OnInit {

  poll$: Observable<Poll>;
  state$: Observable<BallotState>;

  private media$: Subject<string> = new BehaviorSubject('');

  showMobileLayout$: Observable<boolean>;

  options: Observable<BallotOption[]>;

  constructor(private pollSvc: PollService, private voteSvc: VoteService, private route: ActivatedRoute, private router: Router, private store: Store<any>,
              mediaMonitor: MediaMonitor,
              @Inject(BreakPointRegistry) breakpoints: any,
              @Inject(MatchMedia) mediaWatcher: any) {


    this.poll$ = this.pollSvc.activePoll$;

    this.state$ = this.poll$.take(1).flatMap(poll => this.initializeAndReturnBallotState(poll));

    this.options = this.state$.map(state => values(state.options));


    //TODO watch @angular/flex-layout bug #65 and remove this when it's resolved
    breakpoints.items.forEach((bp: any) => mediaWatcher.observe(bp.mediaQuery).subscribe((x: any) => {
      console.log(bp.alias);
      this.media$.next(bp.alias);
    }));

    this.media$ = new BehaviorSubject(mediaMonitor.active.alias);

    this.showMobileLayout$ = this.media$.map(val => val == 'xs');

    /*this.poll =
     this.route.data.map(data => data['poll']) //we resolve the first get
     .flatMap(poll => this.pollSvc.getPollWithVotes(poll.id).startWith(poll)); //and subscribe again to get updates
     */
    //this.poll.subscribe(val => console.log(val));

  }

  private initializeAndReturnBallotState(poll: Poll): Observable<BallotState> {
    this.store.dispatch(new InitializeBallotAction({ poll: poll }));
    return this.store.select(getBallotState);
  }

  ngOnInit() {

  }

  addSelection(opt: BallotOption) {
    this.store.dispatch(new SelectionAddedAction(opt));
  }

  removeSelection(opt: BallotOption) {
    this.store.dispatch(new SelectionRemovedAction(opt));
  }

  reorderSelections(change: { fromIndex: number, toIndex: number }) {
    this.store.dispatch(new SelectionsReordereddAction(change));
  }

  castBallot(vote: PartialVote) {
    this.poll$.take(1)
      .do(poll => this.voteSvc.castVote(vote, poll.id))
      .subscribe(() => {
        this.router.navigate([ 'results' ], { relativeTo: this.route.parent })
      });
  }

  actionTypeChanged(type: 'click'|'drag') {
    this.store.dispatch(new ActionTypeChangedAction(type));
  }


}
