import {Component, Output, EventEmitter, Input} from "@angular/core";
import {Observable} from "rxjs";
import {AuthState, SocialAuthProvider} from "../auth.state";
import {AuthService} from "../auth.service";

@Component({
  selector: 'rcv-auth-widget',
  template: `
    <rcv-auth-widget-view [state]="state$ | async" [dark]="dark" (login)="login($event)" (logout)="logout()" (signup)="signup($event)" (active)="active.emit($event)" *ngIf="!!(state$ | async)"></rcv-auth-widget-view>
  `,
  styles: [ `:host{display: block;}` ]
})
export class AuthWidgetContainerComponent {

  state$: Observable<AuthState>;

  @Output() active: EventEmitter<boolean> = new EventEmitter();
  @Input() dark: boolean;

  constructor(private authSvc: AuthService) {
    this.state$ = authSvc.state$;
  }

  login(input: SocialAuthProvider|{ email: string, password: string }) {
    this.authSvc.login(input);
  }

  logout() {
    this.authSvc.logout();
  }

  signup(info: { email: string, password: string, name: string }) {
    this.authSvc.signup(info);
  }


}
