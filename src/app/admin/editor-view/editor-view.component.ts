import {
  Component,
  trigger,
  transition,
  state,
  style,
  animate,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList
} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {MdInputDirective} from "@angular/material";
import {PartialPoll, PartialPollOption, Poll} from "../../core/poll/poll.models";
import {OptionEditorComponent} from "./option-editor/option-editor.component";

const MIN_OPTIONS = 3;

@Component({
  selector: 'rcv-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: [ './editor-view.component.scss' ],
  animations: [
    trigger('slideDown', [
      state('void', style({ height: 0 })),
      state('*', style({ height: '*' })),
      transition('void <=> *', animate(150))
    ])
  ]
})
export class EditorViewComponent implements OnInit, AfterViewInit {

  @Input() poll: Poll|null;
  @Output() submit: EventEmitter<PartialPoll> = new EventEmitter();

  @ViewChild('prompt', { read: MdInputDirective }) promptInput: MdInputDirective;
  @ViewChildren(OptionEditorComponent, { read: OptionEditorComponent }) optionEditors: QueryList<OptionEditorComponent>;


  simpleForm = new FormGroup({
    prompt: new FormControl('', [ Validators.required, Validators.maxLength(140) ])
  });

  advancedForm = new FormGroup({
    security: new FormControl('unverified', [ Validators.required ]),
    expires: new FormControl(false),
    expirationDate: new FormControl(undefined),
    expirationTime: new FormControl(undefined),
    published: new FormControl(true)
  });

  promptFocused: Subject<boolean> = new BehaviorSubject(false);
  promptPristine: Observable<boolean>;

  expDate: any;

  editingExistentPoll: boolean = false;

  options: PartialPollOption[] = [];


  constructor() {

    this.promptPristine = Observable.combineLatest(this.promptFocused, this.simpleForm.controls[ 'prompt' ].valueChanges.startWith(''))
      .map(([ isFocused, currText ]) => !isFocused && currText == '');

    for (let i = 0; i < MIN_OPTIONS; i++) {this.addOption()}

  }


  ngOnInit() {

    if (this.poll != null) {
      //this means we're editing an existing poll rather than creating a new one.
      this.editingExistentPoll = true;
      console.log('poll not null');
      this.simpleForm.controls[ 'prompt' ].setValue(this.poll.prompt);
      this.options = this.poll.options;
      this.advancedForm.controls[ 'security' ].setValue(this.poll.security);
      this.advancedForm.controls[ 'expires' ].setValue(this.poll.expires);
      if (this.poll.expires) {
        let expiry = this.poll.expiration;
        //TODO
      }
    }
  }

  ngAfterViewInit() {
    this.promptInput.focus();
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
    if (this.options.length < MIN_OPTIONS) {
      this.addOption();
    }
  }

  private addOption() {
    this.options.push({
      color: this.nextColor(),
      text: ''
    });
  }

  private nextColor(): string {
    for (let i = 0; i < COLORS.length; i++) {
      if (this.options.filter(it => it.color === COLORS[ i ]).length == 0) {
        return COLORS[ i ];
      }
    }
    throw `Unsupported: TODO`;
  }

  isValid(): boolean {
    if (!this.simpleForm.controls[ 'prompt' ].valid) {
      return false;
    }

    if (!this.optionEditors) {
      return false;
    }

    let editors = this.optionEditors.toArray();
    for (let i = 0; i < editors.length; i++) {
      if (!editors[ i ].isValid()) {
        return false;
      }
    }

    return true;
  }

  doSubmit() {

    let pass: PartialPoll = Object.assign({}, (this.poll || {}),
      {
        prompt: this.simpleForm.controls[ 'prompt' ].value,
        expires: this.advancedForm.controls[ 'expires' ].value,
        status: 'open' as 'open'|'closed',
        options: this.options,
        security: this.advancedForm.controls[ 'security' ].value,
        published: this.advancedForm.controls[ 'published' ].value
      }
    );

    this.submit.emit(pass);
  }

  publishedSetting(): boolean {
    return this.advancedForm.controls[ 'published' ].value as boolean;
  }


}

const COLORS = [
  "#5C6BC0",
  "#EF5350",
  "#43A047",
  "#7E57C2",
  "#FF8A65",
  "#8D6E63",
  "#F06292",
  "#FDD835",
  "#3ba9c4",
  "#81C784",
  "#868086",
  '#00796B',
  '#D84315',
  '#1B5E20',
  '#FFE57F',
  "#76FF03",
  '#424242',
  "#D500F9",
  "#6D4C41",
  "#D50000",

];
