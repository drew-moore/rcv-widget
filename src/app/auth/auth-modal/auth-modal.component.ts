import {Component, OnInit, Input, AfterViewInit, ViewChild} from "@angular/core";
import {MdDialogRef, MdInputDirective} from "@angular/material";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {EMAIL_REGEX} from "../auth-widget/auth-widget-view.component";
import {AuthService} from "../auth.service";
import {SocialAuthProvider} from "../auth.state";

@Component({
  selector: 'rcv-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: [ './auth-modal.component.scss' ]
})
export class AuthModalComponent implements OnInit, AfterViewInit {

  @ViewChild('emailInput', { read: MdInputDirective }) emailInput: MdInputDirective;

  _message: string = 'You need to have an account to do that, but it only takes a second to create one! You can use:';
  mode: 'login'|'signup' = 'signup';

  @Input() set message(val: string) {
    this._message = val || this._message;
  };

  get message() { return this._message; }

  infoForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    password: new FormControl('', [ Validators.required ]),
    name: new FormControl('', []),
  });

  constructor(private dialogRef: MdDialogRef<AuthModalComponent>, private authSvc: AuthService) {

  }

  ngOnInit() {
  }

  switchMode() {
    this.mode = this.mode == 'login' ? 'signup' : 'login';
    this.emailInput.focus();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.focus();
    });
  }

  socialLogin(provider: SocialAuthProvider) {
    this.authSvc.login(provider).subscribe(res => {
      if (res == true) {
        this.dialogRef.close(true);
      }
    })
  }

  submitForm() {
    let email = this.infoForm.controls[ 'email' ].value,
      password = this.infoForm.controls[ 'password' ].value;

    if (this.mode == 'login') {
      this.authSvc.login({ email, password }).subscribe(result => {

      })
    } else {

    }
  }

  formValid(){
    if (this.mode == 'login'){
      return this.infoForm.controls['email'].valid && this.infoForm.controls['password'].valid;
    } else {
      return this.infoForm.controls['email'].valid &&
        this.infoForm.controls['password'].valid &&
        this.infoForm.controls['name'].valid;
    }
  }


}
