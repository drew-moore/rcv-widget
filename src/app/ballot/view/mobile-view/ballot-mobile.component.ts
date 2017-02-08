import {Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate} from "@angular/core";
import {Poll} from "../../../core/poll/poll.models";
import {BallotState, BallotOption} from "../../ballot.state";


type Mode = 'select'|'reorder';

@Component({
  selector: 'rcv-ballot-mobile-view',
  templateUrl: './ballot-mobile.component.html',

  styleUrls: [ './ballot-mobile.component.scss' ],
  animations: [
    trigger('selectContainer', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('200ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('reorderContainer', [

      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('200ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ]),
  ]
})
export class BallotMobileComponent implements OnInit {
  @Input() poll: Poll;
  @Input() state: BallotState;
  @Input() options: BallotOption[];
  @Output() selectionAdded: EventEmitter<BallotOption> = new EventEmitter();
  @Output() selectionRemoved: EventEmitter<BallotOption> = new EventEmitter();
  @Output() selectionsReordered: EventEmitter<{ fromIndex: number, toIndex: number }> = new EventEmitter();
  @Output() cast = new EventEmitter();

  mode: Mode = 'select';

  paneModes: string = 'pristine';

  sortableOptions = {
    animation: 150,
    onUpdate: (evt: any) => {
      console.log('updatedee!!!');
      console.log(evt);
      this.selectionsReordered.emit({ fromIndex: evt.oldIndex, toIndex: evt.newIndex })
    }
  };

  constructor() {
  }

  ngOnInit() {}

  gotoReorder() {
    this.mode = 'reorder';
  }

  gotoSelect() {
    this.mode = 'select';
  }

  selectionClicked(slot: BallotOption) {
    if (slot.selectedIndex < 0) {
      this.selectionAdded.emit(slot);
    } else {
      this.selectionRemoved.emit(slot);
    }
  }

  isPristine() {
    return this.selectedOptions().length == 0;
  }

  swiped(event: any, opt: BallotOption) {
    console.log(event);
    console.log(opt);
  }

  randomizedOptions() {
    return this.options.sort((x, y) => x.unselectedIndex - y.unselectedIndex);
  }

  selectedOptions() {
    return this.options.filter(opt => opt.selectedIndex >= 0).sort((x, y) => x.selectedIndex - y.selectedIndex);
  }

  submit() {
    this.cast.emit({
      choices: this.selectedOptions().map((it: BallotOption) => it.id),
      published: true
    });
  }


}
