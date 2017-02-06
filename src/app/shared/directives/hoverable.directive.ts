import {Directive, HostListener, Output} from "@angular/core";
import {Subject, BehaviorSubject, Observable} from "rxjs";

@Directive({
  selector: '[hoverable]'
})
export class HoverableDirective {
  private mousedOver: Subject<boolean> = new BehaviorSubject(false);

  @Output()
  public readonly hovered: Observable<boolean>;


  @HostListener('mouseenter')
  private onMouseenter() { this.mousedOver.next(true); }

  @HostListener('mouseleave')
  private onMouseleave() { this.mousedOver.next(false); }

  constructor() {
    this.hovered = this.mousedOver.debounceTime(100).distinctUntilChanged().skip(1);
  }


}
