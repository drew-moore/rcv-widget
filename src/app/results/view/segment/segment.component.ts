import {Component, OnInit, Input, style, animate, transition, trigger} from "@angular/core";
import {PollOption} from "../../../core/poll/poll.models";
import {SuffixedPipe} from "../../../shared/pipes/suffixed.pipe";

@Component({
  selector: 'rcv-segment',
  templateUrl: './segment.component.html',
  styleUrls: [ './segment.component.scss' ],
  animations: [
    trigger('deltaDetail', [
      transition(':enter', [
        style({ width: 0, opacity: 0, transform: 'translateX(20px)' }),
        animate('150ms', style({ opacity: 1, width: '*', transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0, width: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class SegmentComponent implements OnInit {

  @Input() option: PollOption;
  @Input() count: number;
  @Input() round: number;
  @Input() showColor: boolean;
  @Input() showDetail: boolean;
  @Input() showCount: boolean;
  @Input() firstChoice: boolean;

  tooltipText: string;

  private suffixed = new SuffixedPipe();

  constructor() { }

  ngOnInit() {
    console.log('seg initted');
    this.tooltipText = this.firstChoice ? `${this.option.text} was the first choice on ${this.count} ballots` :
      `Inherited ${this.count} ${this.count > 1 ? 'votes' : 'vote'} from ${this.option.text} in the ${this.suffixed.transform(this.round)} round.`;
  }


}
