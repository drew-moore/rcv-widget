import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ViewChild,
  ElementRef,
  Renderer,
  trigger,
  transition,
  style,
  animate,
  ChangeDetectorRef
} from "@angular/core";
import {values} from "lodash";
import {Poll} from "../../core/poll/poll.models";
import {BallotState, BallotOption} from "../ballot.state";

@Component({
  selector: 'rcv-ballot-view',
  templateUrl: 'ballot-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [ 'ballot-view.component.scss' ],
  animations: [
    trigger('unselected', [
      transition('void => nonempty', [
        style({ opacity: 0, transform: 'translateX(100px)' }),
        animate('300ms linear', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('nonempty => void', [
        animate('300ms linear', style({ opacity: 0, transform: 'translateX(100px)' }))
      ])
    ]),
    trigger('selectedSlot', [
      transition('void => nonempty', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate('300ms linear', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('nonempty => void', [
        animate('300ms linear', style({ opacity: 0, transform: 'translateX(-100px)' }))
      ])
    ])
  ],
  // host: {'[@host]':''}
})
export class BallotViewComponent implements AfterViewInit, OnChanges {

  @HostBinding('class') private hostClass = '';

  @Input() poll: Poll;
  @Input() state: BallotState;

  @Output() cast = new EventEmitter();
  @Output() selectionAdded: EventEmitter<BallotOption> = new EventEmitter();
  @Output() selectionRemoved: EventEmitter<BallotOption> = new EventEmitter();
  @Output() selectionsReordered: EventEmitter<{ fromIndex: number, toIndex: number }> = new EventEmitter();

  @Output() actionTypeChange: EventEmitter<'click'|'drag'> = new EventEmitter();

  @ViewChild('selected') selectedPane: ElementRef;

  unselectedSlots: Array<BallotOption|null> = [];
  selectedSlots: Array<BallotOption|null> = [];

  animated: { [id: string]: boolean } = {};
  viewInitialized = false;


  constructor(private renderer: Renderer, private cdr: ChangeDetectorRef) {};


  sortableOptions = {
    animation: 150, filter: '.empty',
    onUpdate: (evt: any) => {
      setTimeout(() => {
        this.selectionsReordered.emit({ fromIndex: evt.oldIndex, toIndex: evt.newIndex });
      }, 100);

    },
    onStart: () => {
      if (this.state.lastAction == 'click') {
        this.actionTypeChange.emit('drag');
      }
    },
    onEnd: () => {
    }
  };

  updateSlots() {
    if (!!this.state) {
      const options = values(this.state.options);

      this.unselectedSlots = [
        ... options.filter(opt => opt.selectedIndex < 0).sort((x, y) => x.unselectedIndex - y.unselectedIndex),
        ... options.filter(opt => opt.selectedIndex >= 0).map(() => null)
      ];

      this.selectedSlots = [
        ... options.filter(opt => opt.selectedIndex >= 0).sort((x, y) => x.selectedIndex - y.selectedIndex),
        ... options.filter(opt => opt.selectedIndex < 0).map(() => null)
      ];

    }

  }

  leftUnselected() {
    return this.unselectedSlots.filter(it => it !== null).length;
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }

  numChoices() {
    return this.selectedSlots.filter(it => it !== null).length + 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'state' ]) {
      this.updateSlots();
    }
  }

  isPristine(): boolean {
    return this.selectedSlots[ 0 ] == null;
  }

  unselectedClicked(slot: BallotOption) {
    if (this.state.lastAction == 'drag') {
      this.actionTypeChange.emit('click');
    }
    this.selectionAdded.emit(slot);
  }

  removeSelection(slot: BallotOption) {
    if (this.state.lastAction == 'drag') {
      this.actionTypeChange.emit('click');
    }
    this.selectionRemoved.emit(slot);

  }


  slotId(idx: number, val: BallotOption|null) {
    if (val) {
      return val.id + '' + val.selectedIndex;
    }
    return idx;
  }


  castVote() {
    let choices: string[] =
      this.selectedSlots.filter(slot => slot !== null).map(slot => (slot as BallotOption).id);

    this.cast.emit({
      choices,
      publicized: true
    });

  }

}
