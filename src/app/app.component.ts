import {Component} from "@angular/core";

@Component({
  selector: 'rcv-root',
  template: '<router-outlet></router-outlet>',
  host: { class: 'app-root' }
})
export class AppComponent {
  title = 'rcv works!';
}
