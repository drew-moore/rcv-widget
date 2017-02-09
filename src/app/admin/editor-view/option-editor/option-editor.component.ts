import {Component, OnInit, Input, EventEmitter, Output, HostListener} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {PartialPollOption} from "../../../core/poll/poll.models";

@Component({
  selector: 'rcv-option-editor',
  templateUrl: './option-editor.component.html',
  styleUrls: [ './option-editor.component.scss' ]
})
export class OptionEditorComponent implements OnInit {

  @Input() option: PartialPollOption;
  @Input() allowRemove: boolean;

  @Output() remove = new EventEmitter();

  readonly MIN_TEXT_LENGTH = 3;
  readonly MAX_TEXT_LENGTH = 50;


  private mouseEvents$: Subject<boolean> = new BehaviorSubject(false);

  @HostListener('mouseenter') private onMouseenter = () => this.mouseEvents$.next(true);

  @HostListener('mouseleave') private onMouseleave = () => this.mouseEvents$.next(false);

  hovered$ = this.mouseEvents$.debounceTime(100);

  inputFocused = new BehaviorSubject(false);

  textForm = new FormGroup({
    text: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ])
  });

  showTextLengthHint: Observable<boolean>;

  constructor() {

    const enteredText = this.textForm.controls[ 'text' ].valueChanges.startWith('');

    const isPristine =
      Observable.combineLatest(this.inputFocused, enteredText)
        .map(([ isFocused, currText ]) => !isFocused && currText == '');

    /* this.showTextLengthHint = Observable.combineLatest(this.inputFocused, enteredText).map(([isFocused, value])=>
     isFocused && value.length > 0 && ()
     );*/

    this.showTextLengthHint = enteredText.map(val =>
      val.length > 0 && (val.length < this.MIN_TEXT_LENGTH || val.length > this.MAX_TEXT_LENGTH)
    );


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
