import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {range} from "lodash";
import {Poll, PollOption} from "../../../core/poll/poll.models";
import {Vote} from "../../../core/vote/vote.models";

@Component({
  selector: 'rcv-choice-table',
  templateUrl: './choice-table.component.html',
  styleUrls: [ './choice-table.component.scss' ]
})
export class ChoiceTableComponent implements OnChanges {

  @Input() poll: Poll;
  @Input() votes: Vote[];

  private tdata: { [id: string]: number[] };

  private columns: number[];
  private rows: { text: string, id: string }[];

  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'votes' ]) {
      this.reinitialize();
    }
  }


  private reinitialize() {
    this.tdata = this.buildTData(this.poll.options, this.votes);
    this.columns = this.tdata[ this.poll.options[ 0 ].id ].map((num, idx) => idx);
    this.rows = this.poll.options.map(opt => ({ text: opt.text, id: opt.id })).sort((x, y) => {
      return this.tdata[ y.id ][ 0 ] - this.tdata[ x.id ][ 0 ];
    })
  }


  private buildTData(options: PollOption[], votes: Vote[]): { [id: string]: number[] } {
    console.log(`building tdata with ${votes.length} votes`);
    let maxChoices = options.length;
    return options.reduce((result, option) => {

      let cols: number[] = range(0, maxChoices).map(num =>
        votes.filter(vote => vote.choices.length > num)
          .filter(vote => vote.choices[ num ] == option.id)
          .length
      );

      return Object.assign(result, { [option.id]: cols })

    }, {});
  }


}
