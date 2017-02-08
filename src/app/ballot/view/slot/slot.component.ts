import {Component, OnInit, Input, HostBinding, HostListener, Output, EventEmitter} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {BallotOption} from "../../ballot.state";

@Component({
  selector: 'rcv-slot',
  templateUrl: './slot.component.html',
  styleUrls: [ './slot.component.scss' ]
})
export class SlotComponent implements OnInit {

  @Input() option: BallotOption|null;
  @Input() selected: boolean;

  @Output() select = new EventEmitter();

  @Output() remove = new EventEmitter();

  private mouseEvents$: Subject<boolean> = new BehaviorSubject(false);
  private focused$: Subject<boolean> = new BehaviorSubject(false);

  @HostListener('mouseenter') private onMouseenter = () => this.mouseEvents$.next(true);

  @HostListener('mouseleave') private onMouseleave = () => this.mouseEvents$.next(false);

  @HostListener('click')
  private onClick() {
    if (!this.selected && this.option != null) {
      this.select.emit();
    }
  }

  @HostListener('keypress', [ '$event' ])
  private onKeypress(evt: KeyboardEvent) {
    if (this.option != null) {
      if (this.selected) {
        this.remove.emit();
      } else {
        this.select.emit();
      }
    }
  }

  hovered$ = this.mouseEvents$.debounceTime(100);


  @HostBinding('class')
  private get clazz() {
    return this.option == null ? 'slot empty' : 'slot';
  }

  constructor() {
  }


  ngOnInit() {}

}
