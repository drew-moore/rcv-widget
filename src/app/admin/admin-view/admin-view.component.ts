import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/core";
import {Poll} from "../../core/poll/poll.models";
import {Vote} from "../../core/vote/vote.models";

@Component({
  selector: 'rcv-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: [ './admin-view.component.scss' ],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate(150))
    ])
  ]
})
export class AdminViewComponent implements OnInit {


  @Input() poll: Poll;
  @Input() votes: Vote[];

  @Input() firstView: boolean;

  @Output() gotoEdit = new EventEmitter();
  @Output() toggleStatus = new EventEmitter();

  @ViewChild('fullCode') private fullCodeEl: ElementRef;
  @ViewChild('halfCode') private halfCodeEl: ElementRef;
  @ViewChild('miniCode') private miniCodeEl: ElementRef;

  twitterButton: any;


  editing = {
    prompt: false,
    options: {}
  };

  constructor() {
  }

  ngOnInit() {

    this.editing.options = this.poll && this.poll.options ? this.poll.options.reduce((result, opt) => Object.assign(result, {
        [opt.id]: {
          text: false,
          image: false
        }
      })) : {};


  }


  pollUrl(): string|undefined {
    if (this.poll) {
      return `https://rcv-app.firebaseapp.com/poll/${this.poll.id}`
    }
  }

  embedLink(size: 'full'|'half'|'mini'): string|undefined {
    if (this.poll) {
      let width = size == 'full' ? '96vw' : size == 'half' ? '50vw' : '400px';
      let height = size == 'full' ? '96vw' : size == 'half' ? '50vw' : '300px';
      return `<iframe src="https://rcv-app.firebaseapp.com/embed/${this.poll.id}" style="width:${width}; height:${height}"></iframe>`
    }
  }

  votesInTime(time: 'all'|'month'|'week'|'day'): number {
    if (!!this.votes) {
      switch (time) {
        case 'all':
          return this.votes.length;
        case 'month':
          return Math.round(this.votes.length * 0.7);
        case 'week':
          return Math.round(this.votes.length * 0.4);
        case 'day':
          return Math.round(this.votes.length * 0.1);
      }
    }
    return 0;
  }

  editPrompt() {
    this.editing.prompt = !this.editing.prompt;
  }

  openSuccessDialog() {

  }

  copyEmbedCode() {

  }


  ngAfterViewInit() {

  }


}
