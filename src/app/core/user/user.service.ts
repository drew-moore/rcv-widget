import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";
import {User, UserEntity} from "./user.model";
import * as users from "./user.functions";
import {UsersState} from "./user.state";
import {Store} from "@ngrx/store";
import {AppState, getUserState, getSessionUserEntity} from "../../state";
import {AuthInfo} from "../../auth/auth.state";

@Injectable()
export class UserService {

  public readonly state$: Observable<UsersState>;

  public readonly sessionUser$: Observable<User|null>;


  constructor(private db: AngularFireDatabase, private store: Store<AppState>) {

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


  verifyRecordForAuthAccount(info: AuthInfo): void {
    this.db.object(`/users/${info.uid}`).take(1).subscribe((it: UserEntity) => {
      if (!it.$exists()) {
        this.createRecordForAuthAccount(info);
      }
    })
  }

  createRecordForAuthAccount(info: AuthInfo): void {
    this.db.object(`/users`).set({ [info.uid]: users.forAuthInfo(info) })
      .then((result) => console.info(`created user record for user ${info.displayName} (${info.uid})`))
      .catch(err => {throw err;});
  }

}
