import {Component, OnInit, Input, trigger, transition, style, animate, keyframes, HostBinding} from "@angular/core";
import {PollOutcome} from "../../results.models";
import {PollOption, Poll} from "../../../core/poll/poll.models";
import {Vote} from "../../../core/vote/vote.models";


@Component({
  selector: 'rcv-outcome-bar',
  templateUrl: './outcome-bar.component.html',
  styleUrls: [ './outcome-bar.component.scss' ],
  animations: [
    trigger('winnerText', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('1000ms 1000ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('250ms', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('runnerUpText', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('1000ms 1000ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('250ms', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])

    ]),
    trigger('segment', [
      transition(':enter', [
        style({ transform: 'scaleX(0)' }),
        animate('750ms 950ms linear', style({ transform: 'scaleX(1)' }))
      ])
    ]),
    trigger('line', [
      transition(':enter', [
        animate('600ms 500ms ease-out', keyframes([
          style({ transform: 'scaleY(0)', opacity: 0 }),
          style({ transform: 'scaleY(0.5)', opacity: 1 }),
          style({ transform: 'scaleY(1)', opacity: 1 })
        ]))
      ]),
      transition(':leave', [
        animate('250ms', style({ transform: 'scaleY(0)', opacity: 0 }))
      ])
    ])
  ]
})
export class OutcomeBarComponent implements OnInit {
  @Input() outcome: PollOutcome;
  @Input() poll: Poll;
  @Input() minimize: boolean;
  @Input() userVote: Vote;
  private optMap: { [id: string]: PollOption };

  @HostBinding('class') get hostClass() {
    return this.minimize ? 'minimal' : '';
  }


  constructor() { }

  ngOnInit() {
    this.optMap = this.poll.options.reduce((result, next) => Object.assign(result, { [next.id]: next }), {});
  }

  isTie() {
    return this.outcome.places[ 1 ].place == 1;
  }


  getWinners(): PollOption[] {
    if (this.outcome.places[ 1 ].place == 1) {
      //it's a tie for first - there can't possibly be more than 2 people tied
      return [ this.optMap[ this.outcome.places[ 0 ].id ], this.optMap[ this.outcome.places[ 1 ].id ] ];
    } else {
      return [ this.optMap[ this.outcome.places[ 0 ].id ] ];
    }
  }

  getRunnersUp(): PollOption[] {
    //if there's a tie for first, the runner up is at index 2, otherwise at index 1
    let startIdx = this.outcome.places[ 1 ].place == 1 ? 2 : 1;
    let runnerUpPlace = this.outcome.places[ startIdx ].place;

    let toReturn: PollOption[] = [];

    for (let i = startIdx; i < this.outcome.places.length; i++) {
      if (this.outcome.places[ startIdx ].place == runnerUpPlace) {
        toReturn.push(this.optMap[ this.outcome.places[ i ].id ]);
      } else {
        break;
      }
    }
    return toReturn;
  }

  leftBarPercentage() {
    return Math.round((this.outcome.places[ 0 ].score / this.outcome.places[ 0 ].outOf) * 1000) / 10
  }

  rightBarPercentage() {
    return this.isTie() ? 50 : Math.round((this.outcome.places[ 1 ].score / this.outcome.places[ 1 ].outOf) * 1000) / 10;
  }

  get winnerText(): string {
    let winners = this.getWinners();
    let winPct = Math.round((this.outcome.places[ 0 ].score / this.outcome.places[ 0 ].outOf) * 1000) / 10;
    if (winners.length > 1) {
      //it's a tie
      return `<strong>${winners[ 0 ].text}</strong> and <strong>${winners[ 1 ].text}</strong> TIE with 50% of the final vote `
    } else {
      return `<strong>${winners[ 0 ].text}</strong> wins with <strong>${winPct}%</strong> of the final vote`
    }
  }

  get runnerUpText(): string {
    let runnersUp = this.getRunnersUp();
    let runnerUpIdx = this.isTie() ? 2 : 1;
    let pct = Math.round((this.outcome.places[ runnerUpIdx ].score / this.outcome.places[ runnerUpIdx ].outOf) * 1000) / 10;

    return `<strong>${runnersUp[ 0 ].text}</strong> finishes second with ${pct}%`;
  }


}
