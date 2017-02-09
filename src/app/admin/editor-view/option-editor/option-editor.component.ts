import {Component, OnInit, Input, EventEmitter, Output, HostListener} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {PartialPollOption} from "../../../core/poll/poll.models";

const PRISTINE_PLACEHOLDER = 'Text: The name or a brief description of this option';
const DIRTY_PLACEHOLDER = 'Text:';

@Component({
  selector: 'rcv-option-editor',
  templateUrl: './option-editor.component.html',
  styleUrls: [ './option-editor.component.scss' ]
})
export class OptionEditorComponent implements OnInit {

  @Input() option: PartialPollOption;
  @Output() remove = new EventEmitter();


  private mouseEvents$: Subject<boolean> = new BehaviorSubject(false);

  @HostListener('mouseenter') private onMouseenter = () => this.mouseEvents$.next(true);

  @HostListener('mouseleave') private onMouseleave = () => this.mouseEvents$.next(false);

  hovered$ = this.mouseEvents$.debounceTime(100);

  inputFocused = new BehaviorSubject(false);
  placeholder: Observable<string>;
  textForm = new FormGroup({
    text: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ])
  });


  constructor() {


    const isPristine =
      Observable.combineLatest(this.inputFocused, this.textForm.controls[ 'text' ].valueChanges.startWith(''))
        .map(([ isFocused, currText ]) => !isFocused && currText == '');

    this.placeholder = isPristine.map(val => val == true ? PRISTINE_PLACEHOLDER : DIRTY_PLACEHOLDER).startWith(PRISTINE_PLACEHOLDER);

    this.textForm.controls[ 'text' ].valueChanges.subscribe(val => {
      this.option.text = val; // we could do this via the non-reactive FormsModule and ngModel, but this is more testable
    });
  }

  ngOnInit() {
    if (!!this.option.text) {
      this.textForm.controls[ 'text' ].setValue(this.option.text);
    }
  }

  public isValid() {
    return this.textForm.controls[ 'text' ].valid;
  }


}
