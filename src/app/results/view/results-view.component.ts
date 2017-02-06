import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild
} from "@angular/core";
import {values, keys} from "lodash";
import {Poll, PollOption} from "../../core/poll/poll.models";
import {ResultsState, OptionStateSnapshot, RoundState, PollOutcome} from "../results.models";
import {MdSidenav} from "@angular/material";

@Component({
  selector: 'rcv-results-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-view.component.html',
  styleUrls: [ './results-view.component.scss' ],

})
export class ResultsViewComponent implements OnInit, OnChanges {

  @Input() poll: Poll;
  @Input() state: ResultsState;
  @Input() private initialized: boolean;

  @Output() nextRound = new EventEmitter();
  @Output() prevRound = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() barHover = new EventEmitter();
  @Output() segmentHover = new EventEmitter();
  @Output() remove: EventEmitter<string> = new EventEmitter();
  @Output() unremove: EventEmitter<string> = new EventEmitter();

  @ViewChild('menu', { read: MdSidenav }) menu: MdSidenav;

  inactiveVotesTooltip = "A vote is inactive when all choices ranked in it have been eliminated.";
  totalVotesTooltip = "This is the total number of votes cast minus the number of inactive votes - 50% of this number is needed to win.";


  private optionMap: { [id: string]: PollOption };


  private optionStates: OptionStateSnapshot[];

  lastRemovedOption: string;


  constructor() {

  }

  ngOnInit() {

    this.optionMap = this.poll.options.reduce((result, next) => Object.assign(result, { [next.id]: next }), {});

    /*    setTimeout(()=> {
     this.state.currRound++;
     }, 7000);*/
  }

  buffer() {
    return 35 - this.state.currRound;
  }


  axisPos(percent: number): number {
    if (!this.initialized) {
      return percent;
    }
    let max = this.maxCurrPct();
    return ((100 - this.buffer()) / max) * (percent / 100);
  }

  barScale(): (val: number) => number {
    let max = this.maxCurrScore();
    return (val) => {
      return (val / max) * (100 - this.buffer());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  private maxCurrScore(): number {
    return values(this.state.rounds[ this.state.currRound ].options).sort((x, y) => y.votes.count - x.votes.count)[ 0 ].votes.count;
  }

  private maxCurrPct(): number {
    let leader = values(this.state.rounds[ this.state.currRound ].options).sort((x, y) => y.votes.count - x.votes.count)[ 0 ];
    return leader.votes.count / leader.votes.outOf;
  }

  get options(): BarViewModel[] {
    if (!this.poll || !this.state) {
      console.log(this.state);
      return [];
    } else {
      return this.poll.options.map(option => {
        let rounds: OptionStateSnapshot[] = this.state.rounds.map(round => round.options[ option.id ]);
        return Object.assign({}, { option, rounds })
      }).sort((x, y) => y.rounds[ 0 ].votes.count - x.rounds[ 0 ].votes.count);
    }
  }

  barId(idx: number, opt: BarViewModel) {
    return opt.option.id;
  }

  currState(): RoundState {
    return this.state.rounds[ this.state.currRound ];
  }

  get narrationState(): 'undetermined'|'outright'|'tie'|'pristine' {
    let currState = this.currState();
    /*    if (currState.round == 0){
     return 'pristine';
     }*/
    if (currState.outcome == false) {
      return 'undetermined';
    } else {
      if (currState.outcome.places[ 1 ].place == 1) {
        return 'tie'
      } else {
        return 'outright'
      }
    }
  }

  barHovered(barId: string, value: boolean) {
    this.barHover.emit({ barId, value })
  }

  segmentHovered(barId: string, event: { segment: string, value: boolean }) {
    this.segmentHover.emit({ barId, segmentId: event.segment, value: event.value });
  }

  pristineStatement() {
    return `A candidate must have 50% Since no candidate has 50% of first choices, we'll eliminate the lowest-scoring candidate and redistribute their votes to their next choices.`;
  }

  get unremovedOptions() {
    return this.poll.options.filter(option => this.state.removed.indexOf(option.id) < 0);
  }

  get removedOptions() {
    return this.state.removed.map(id => this.optionMap[ id ]);
  }


  removeOption(id: string) {

    this.menu.close().then(() => {
      this.lastRemovedOption = '';
      this.remove.emit(id);
    })
  }

  unremoveOption(id: string) {
    this.menu.close().then(() => {
      this.lastRemovedOption = '';
      this.unremove.emit(id);
    })
  }


  leaderText() {
    let currState = this.currState();
    let leaderId = keys(currState.options).sort((x, y) => currState.options[ y ].votes.count - currState.options[ x ].votes.count)[ 0 ];
    let leader = this.optionMap[ leaderId ];
    let leaderState = currState.options[ leaderId ];
    let leaderPct = Math.round((leaderState.votes.count / leaderState.votes.outOf) * 1000) / 10;
    let toWin = Math.ceil(leaderState.votes.outOf / 2);
    let needs = toWin - leaderState.votes.count;

    return `<strong>${leader.text}</strong> leads with <strong>${leaderPct}%</strong> of active votes, but needs ${needs} more votes to reach 50% and win.`

  }

  loserText() {
    let currState = this.currState();
    if (currState.outcome) {

    } else {

      let nextRound = this.state.rounds[ this.state.currRound + 1 ];
      let loserId = nextRound.eliminated[ nextRound.eliminated.length - 1 ];
      let loser = this.optionMap[ loserId ];
      return `${loser.text} has the fewest votes of any remaining option, and will be eliminated next.`
    }
  }

  tieStatement() {
    let outcome = this.currState().outcome as PollOutcome;
    let tiedTexts = outcome.places.filter(it => it.place == 1).map(it => it.id).map(id => this.optionMap[ id ].text);
    return `<strong>${tiedTexts[ 0 ]}</strong> and <strong>${tiedTexts[ 1 ]}</strong> TIE with ${outcome.places[ 0 ].score} votes each.`
  }

  winnerStatement() {
    let winnerId = this.state.outcome.places[ 0 ].id;
    let winner = this.optionMap[ winnerId ];
    let winnerVotes = this.state.outcome.places[ 0 ].score;
    let outOf = this.state.outcome.places[ 0 ].outOf;
    let winPct = Math.round((winnerVotes / outOf) * 1000) / 10;
    return `${winner.text} wins with ${winPct}% of the final vote!`

  }

  runnerUpStatement() {
    if (this.state.outcome.places.length > 2 && this.state.outcome.places[ 2 ].place == this.state.outcome.places[ 1 ].place) {
      //we have a tie for second
    } else {
      let runnerUpId = this.state.outcome.places[ 1 ].id;
      let runnerUp = this.optionMap[ runnerUpId ];
      let runnerUpVotes = this.state.outcome.places[ 1 ].score;
      let outOf = this.state.outcome.places[ 1 ].outOf;
      let pct = Math.round((runnerUpVotes / outOf) * 1000) / 10;
      return `${runnerUp.text} finishes second with ${pct}%.`
    }
  }


}

export type BarViewModel = {
  option: PollOption
  rounds: OptionStateSnapshot[];
}
