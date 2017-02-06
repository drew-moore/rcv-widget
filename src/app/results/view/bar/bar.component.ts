import {
  Component,
  OnInit,
  Input,
  trigger,
  transition,
  style,
  animate,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import {PollOption} from "../../../core/poll/poll.models";
import {OptionStateSnapshot, OutboundVoteTransfer, InboundVoteTransfer} from "../../results.models";
import {Subject, BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'rcv-bar',
  templateUrl: './bar.component.html',
  styleUrls: [ './bar.component.scss' ],
  animations: [
    trigger('bar', [
      transition(`void => uninitialized`, [
        style({ transform: 'scaleX(0)' }),
        animate('250ms 1000ms ease-out', style({ transform: 'scaleX(1)' }))
      ]),
      transition(`void => initialized`, [
        style({ transform: 'scaleX(0)' }),
        animate('250ms ease-out', style({ transform: 'scaleX(1)' }))
      ]),
      transition('initialized => void', [
        animate('250ms ease-out', style({ transform: 'scaleX(0)' }))
      ])
    ]),
    trigger('info', [
      transition(`void => *`, [
        style({ color: '#424242' }),
        animate('250ms 1000ms ease-out', style({ color: 'rgba(255,255,255,0.87)' }))
      ])
    ]),
    trigger('details', [
      transition(`void => uninitialized`, [
        style({ opacity: '0' }),
        animate('400ms 1100ms', style({ opacity: 1 }))
      ]),
      transition(`void => initialized`, [
        style({ opacity: '0' }),
        animate('400ms', style({ opacity: 1 }))
      ]),

      transition(`initialized => void`, [
        animate('400ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('delta', [
      transition(`void => up`, [
        style({ opacity: '0', transform: 'translateY(20px)' }),
        animate('150ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('up => void', [
        animate('150ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ]),
      transition(`void => out`, [
        style({ opacity: '0', transform: 'translateX(-20px)', width: 0 }),
        animate('150ms 150ms ease-out', style({ opacity: 1, transform: 'translateX(0)', width: '*' }))
      ]),
      transition('out => void', [
        animate('150ms ease-out', style({ opacity: 0, transform: 'translateX(-20px)', width: 0 }))
      ])
    ]),
    /*    trigger('rect', [
     transition(':enter', [
     style({transform:'scaleX(0)'}),
     animate('250ms 150ms ease-out', style({transform:'scaleX(1)'}))
     ]),
     transition(':leave', [
     animate('150ms', style({transform:'scaleX(0)'}))
     ])
     ]),*/
    trigger('rect', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('segments', [
      transition(`void => *`, [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),

      transition(`* => void`, [
        animate('150ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BarComponent implements OnInit {

  @Input() option: PollOption;
  @Input() rounds: OptionStateSnapshot[];
  @Input() currRound: number;
  @Input() scale: (val: number) => number;
  @Input() hoverState: { bar?: string, segment?: string };

  @Output() unremove = new EventEmitter();
  @Output() barHovered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() segmentHovered: EventEmitter<{ segment: string, value: boolean }> = new EventEmitter<{ segment: string, value: boolean }>();


  private parentHovers$: Subject<boolean> = new BehaviorSubject(false);
  parentHovered$: Observable<boolean>;

  @HostListener('mouseenter') private onMouseenter = () => this.parentHovers$.next(true);

  @HostListener('mouseleave') private onMouseleave = () => this.parentHovers$.next(false);

  initialized: boolean = false;


  constructor() {
    this.parentHovered$ = this.parentHovers$.skip(1).debounceTime(150).share();
    this.parentHovered$.subscribe(val => {
      this.barHovered.emit(val);
    })
  }

  ngOnInit() {

  }

  get isHovered() {
    return this.hoverState.bar && this.hoverState.bar == this.option.id;
  }

  get roundEliminated(): number {
    for (let i = 0; i < this.rounds.length; i++) {
      if (this.rounds[ i ].status == 'eliminated') {
        return i;
      }
    }
    return -1;
  }


  get visibleDeltas(): InboundVoteTransfer[] {
    let it = this.rounds[ this.currRound ].votesIn;
    if (this.currRound == 0 || this.isHovered || !it) {
      return [];
    } else {
      return [ it as InboundVoteTransfer ];
    }
  }

  get showBar() {
    return !(this.state.status == 'eliminated' || this.state.status == 'removed');
  }

  get visibleSegments(): InboundVoteTransfer[] {
    if (this.isHovered) {
      return this.rounds
        .slice(0, this.currRound + 1)
        .filter(round => !!round.votesIn)
        .map(round => round.votesIn) as InboundVoteTransfer[];
    } else {
      if (!!this.hoverState.segment) {
        return this.rounds
          .slice(0, this.currRound + 1)
          .filter(round => !!round.votesIn && round.votesIn.source.id == this.hoverState.segment)
          .map(round => round.votesIn) as InboundVoteTransfer[];
      } else {
        return [];
      }
    }
  }

  emitSegmentHover(segment: string, value: boolean) {
    if (segment !== this.option.id) {
      this.segmentHovered.emit({ segment, value });
    }
  }

  isSegmentHovered(id: string) {
    return this.hoverState.segment && this.hoverState.segment == id;
  }

  get totalVotesOut() {
    let transfers: OutboundVoteTransfer[];

    if (this.rounds[ this.roundEliminated ].votesOut == undefined) {
      debugger;
      throw 'why no votes out? (TODO improve this msg)'
    } else {
      transfers = this.rounds[ this.roundEliminated ].votesOut as OutboundVoteTransfer[];
    }
    return transfers.reduce((result, next) => result + next.count, 0);
  }

  get barWidth(): number {
    return this.scale(this.rounds[ this.currRound ].votes.count);
  }

  get currPct(): number {
    let entry = this.rounds[ this.currRound ].votes;
    return Math.round((entry.count / entry.outOf) * 1000) / 10;
  }

  get state(): OptionStateSnapshot {
    return this.rounds[ this.currRound ];
  }

  setInitialized() {
    this.initialized = true;
  }

  get detailState() {
    if (this.state.status == 'active') {
      return 'stats';
    } else if (this.state.status == 'eliminated') {
      if (this.rounds[ this.currRound - 1 ].status == 'active') {
        return 'last-eliminated'
      } else {
        return 'eliminated'
      }
    } else if (this.state.status == 'removed') {
      return 'removed';
    }
  }

  rectWidth(val: number) {
    return this.scale(val);
  }

  segmentId(idx: number, it: any) {
    return it.option.id;
  }

  get segments() {
    return this.rounds.slice(0, this.currRound + 1)
      .filter((round, idx) => idx == 0 || !!round.votesIn)
      .map((entry, idx) => {
        let votesIn = entry.votesIn as InboundVoteTransfer;
        let count = idx == 0 ? this.rounds[ 0 ].votes.count : votesIn.count;
        let option = idx == 0 ? this.option : votesIn.source;
        let round = idx == 0 ? 0 : votesIn.round;
        return {
          count, option, round
        }
      })
  }


}

export type SegmentADT = {
  value: number;

}
