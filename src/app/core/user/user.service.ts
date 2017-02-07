import {Injectable} from "@angular/core";
import {PollService} from "../poll/poll.service";
import {VoteService} from "../vote/vote.service";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";
import {User, UserEntity} from "./user.model";
import * as users from "./user.functions";
import {UsersState} from "./user.state";
import {Store} from "@ngrx/store";
import {AppState, getUserState, getSessionUserEntity} from "../../state";

@Injectable()
export class UserService {

  public readonly state$: Observable<UsersState>;

  public readonly sessionUser$: Observable<User|null>;


  constructor(private db: AngularFireDatabase, private store: Store<AppState>, private pollSvc: PollService, voteSvc: VoteService) {

    this.state$ = store.select(getUserState);

    this.sessionUser$ = store.select(getSessionUserEntity);


  }


  loadUserData(id: string): Observable<User> {
    return this.db.object(`/users/${id}`)
      .map(it => it as UserEntity)
      .map(it => users.forEntity(it));
  }


  addSessionUserVote(pollId: string, voteId: string) {
    this.sessionUser$.take(1).subscribe(user => {
      if (user == null) {
        console.info(`Session user is null, not persisting vote to user obj`);
        return;
      } else {
        this.db.object(`/users/${user.id}/votes`).update({ [pollId]: voteId })
      }
    });
  }

  addSessionUserPoll(pollId: string) {
    this.sessionUser$.take(1).subscribe(user => {
      if (user == null) {
        console.info(`Session user is null, not persisting vote to user obj`);
        return;
      } else {
        this.db.object(`/users/${user.id}/polls`).update({ [pollId]: true })
      }
    });
  }


}
