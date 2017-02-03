import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'rcv-results-container',
  template: `
    <rcv-results-view></rcv-results-view>
  `,
  styles: []
})
export class ResultsContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
