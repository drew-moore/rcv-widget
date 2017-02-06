import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2";
import {Store} from "@ngrx/store";
import {AppState} from "../../state";


@Injectable()
export class PollService {

  constructor(private db: AngularFireDatabase, private store: Store<AppState>) {

  }


}
