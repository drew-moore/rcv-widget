import {Component, OnInit} from "@angular/core";
import {PollService} from "../core/poll/poll.service";
import {PartialPoll} from "../core/poll/poll.models";
import {MdDialog} from "@angular/material";
import {AuthModalComponent} from "../auth/auth-modal/auth-modal.component";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'rcv-create-container',
  template: `
    <rcv-editor-view [poll]="null" (submit)="submit($event)"></rcv-editor-view>
  `,
  styles: []
})
export class CreateContainerComponent implements OnInit {

  constructor(private pollSvc: PollService, private dialog: MdDialog, private authSvc: AuthService) { }

  ngOnInit() {
  }

  submit(poll: PartialPoll) {
    this.authSvc.sessionUser$.take(1).subscribe(user => {
      if (!user) {
        let dialog = this.dialog.open(AuthModalComponent);
        dialog.afterClosed().subscribe(result => {
          if (result == true) {
            this.doSubmit(poll);
          }
        })
      } else {
        this.doSubmit(poll);
      }
    });
  }

  private doSubmit(poll: PartialPoll) {
    this.pollSvc.createPoll(poll).subscribe(result => {
      console.log('successful create!!');
    });
  }

}
