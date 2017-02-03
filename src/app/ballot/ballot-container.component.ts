import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'rcv-ballot-container',
  template: `
    <rcv-ballot-view></rcv-ballot-view>
  `,
  styles: []
})
export class BallotContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
