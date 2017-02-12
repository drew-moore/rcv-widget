import {
  Component,
  OnInit,
  style,
  animate,
  transition,
  trigger,
  keyframes,
  state,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {SocialAuthProvider, AuthState} from "../auth.state";

@Component({
  selector: 'rcv-auth-widget-view',
  templateUrl: './auth-widget-view.component.html',
  styleUrls: [ './auth-widget-view.component.scss' ],
  animations: [
    trigger('slideRight', [
      transition('void => *', [
        style({ transform: 'translateX(300px)' }),
        animate('150ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('150ms ease-in', style({ transform: 'translateX(300px)' }))
      ])
    ]),
    trigger('collapseRight', [
      state('collapsed', style({
        transform: 'translateX(125px)scaleX(0)',
        opacity: 0,
        width: 0
      })),
      state('uncollapsed', style({
        transform: 'translateX(0)scaleX(1)',
        opacity: 1,
        width: '*'
      })),
      transition('collapsed => uncollapsed', animate('150ms 250ms')),
      transition('uncollapsed => collapsed', animate('150ms'))
    ]),
    trigger('width', [
      state('wide', style({
        width: '*'
      })),
      state('short', style({
        width: '120px'
      })),
      transition('inactive => active', animate('250ms 100ms ease')),
      transition('active => inactive', animate('150ms ease'))
    ]),
    trigger('growRight', [
      transition('void => *', [
        style({ width: 0, transform: 'scaleX(0)' }),
        animate('250ms 200ms ease', keyframes([
          style({ width: 0, transform: 'scaleX(0)' }),
          style({ width: '*', transform: 'scaleX(0)' }),
          style({ width: '*', transform: 'scaleX(1)' }),
        ]))
      ]),
      transition('* => void', [
        animate('150ms ease', keyframes([
          style({ width: '*', transform: 'scaleX(1)' }),
          style({ width: '*', transform: 'scaleX(0)' }),
          style({ width: 0, transform: 'scaleX(0)' }),
        ]))
      ])
    ]),
    trigger('mainBtns', [
      transition('void => *', [

        animate('250ms 250ms ', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        style({
          opacity: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0
        }),
        animate('250ms linear', style({ opacity: 0 }))
      ]),
    ]),
  ]
})
export class AuthWidgetViewComponent implements OnInit {

  @Input() state: AuthState;
  @Input() dark: boolean;

  @Output() login: EventEmitter<SocialAuthProvider|{ email: string, password: string }> = new EventEmitter<SocialAuthProvider|{ email: string, password: string }>();
  @Output() logout = new EventEmitter();
  @Output() signup: EventEmitter<{ email: string, password: string, name: string }> = new EventEmitter<{ email: string, password: string, name: string }>();

  @Output() active = new EventEmitter();

  constructor() {

    const inputNonempty =
      this.infoForm.controls[ 'email' ].valueChanges.map(val => !!val).startWith(false);


    this.inputActive = this.inputFocused.withLatestFrom(inputNonempty,
      (inputFocused, inputNonempty) => inputNonempty || inputFocused);

  }

  ngOnInit() {

  }

  mode: 'LOGIN'|'SIGNUP'|'INACTIVE' = 'INACTIVE';
  inputActive: Observable<boolean>;
  userMenuShown: boolean;

  private inputFocused: Subject<boolean> = new BehaviorSubject(false);


  infoForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    password: new FormControl('', [ Validators.required ]),
    name: new FormControl('', []),
  });


  get inactive(): boolean {
    return this.mode === 'INACTIVE';
  }

  get loginActive(): boolean {
    return this.mode === 'LOGIN';
  }

  get signupActive(): boolean {
    return this.mode === 'SIGNUP';
  }

  loginClicked() {
    if (this.mode == 'INACTIVE') {
      this.active.emit(true);
    }
    this.mode = 'LOGIN'
  }

  signupClicked() {
    if (this.mode == 'INACTIVE') {
      this.active.emit(true);
    }
    this.mode = 'SIGNUP';
  }



  inputFocus() {
    this.inputFocused.next(true);
  }

  inputBlur() {
    this.inputFocused.next(false);
  }

  socialLogin(providerName: SocialAuthProvider) {
    this.login.emit(providerName)
  }

  submitClicked() {
    if (this.mode == 'LOGIN') {
      this.emailLogin();
    } else {
      this.emailSignup();
    }
    this.active.emit(false);
  }

  emailLogin() {
    let email = this.infoForm.controls[ 'email' ].value,
      password = this.infoForm.controls[ 'password' ].value;

    this.login.emit({ email, password });
  }

  emailSignup() {
    let email = this.infoForm.controls[ 'email' ].value,
      password = this.infoForm.controls[ 'password' ].value,
      name = this.infoForm.controls[ 'name' ].value;

    this.signup.emit({ email, password, name });
  }

  showUserMenu(val?: boolean) {
    this.userMenuShown = val === undefined ? !this.userMenuShown : val;
  }

  doLogout() {
    this.logout.emit();
  }
}

export const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
