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
  animate
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

  @ViewChild('selected') selectedPane: ElementRef;

  unselectedSlots: Array<BallotOption|null> = [];
  selectedSlots: Array<BallotOption|null> = [];

  animated: { [id: string]: boolean } = {};
  viewInitialized = false;

  animate: string|null = null;

  currIndices: { [id: string]: number };


  constructor(private renderer: Renderer) {};

  reordering: boolean = false;

  sortableOptions = {
    animation: 150, filter: '.empty',
    onUpdate: (evt: any) => {
      this.reordering = true;
      setTimeout(() => {
        this.selectionsReordered.emit({ fromIndex: evt.oldIndex, toIndex: evt.newIndex });
      }, 100);

    },
    onStart: () => {
      this.renderer.setElementClass(this.selectedPane.nativeElement, 'drag-active', true);
    },
    onEnd: () => {
      this.renderer.setElementClass(this.selectedPane.nativeElement, 'drag-active', false);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'state' ]) {
      this.updateSlots();
    }
  }

  isPristine(): boolean {
    return this.selectedSlots[ 0 ] == null;
  }

  numChoices() {
    return this.selectedSlots.filter(it => it !== null).length + 1;
  }

  unselectedClicked(slot: BallotOption) {
    this.reordering = false;
    this.selectionAdded.emit(slot);
  }

  removeSelection(slot: BallotOption) {
    this.reordering = true;
    setTimeout(() => {
      this.selectionRemoved.emit(slot);
      setTimeout(() => {
        this.reordering = false;
      }, 500);
    }, 100);
  }

  selectedAnimationDone() {

  }

  slotId(idx: number, val: BallotOption|null) {
    if (val) {
      return val.id + '' + val.selectedIndex;
    }
    return idx;
  }


  update = (change: { fromIndex: number, toIndex: number }) => {
    console.log(change);
    this.selectionsReordered.emit(change);
  };

  /**
   *
   * We do this to disable subsequent animations
   */
  animateInDone(it: BallotOption|null) {
    if (!!it) {
      this.animated[ it.id ] = true;
    }
  }

  /**
   *
   * We do this to disable subsequent animations
   */
  animStart(it: BallotOption|null) {

    this.currIndices = this.selectedSlots.filter(x => x != null)
      .map(opt => opt as BallotOption) // avoid possibly null error
      .reduce((result, next) => Object.assign(result, { [next.id]: next.selectedIndex }), {});

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
