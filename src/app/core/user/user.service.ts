import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";
import {User, UserEntity} from "./user.model";
import * as users from "./user.functions";
import {UsersState} from "./user.state";
import {Store} from "@ngrx/store";
import {AppState, getUserState, getSessionUserData, getAuthUserId} from "../../state";
import {AuthInfo} from "../../auth/auth.state";

@Injectable()
export class UserService {

  public readonly state$: Observable<UsersState>;

  public readonly sessionUser$: Observable<User|null>;

  private authUserId$: Observable<string>;

  constructor(private db: AngularFireDatabase, private store: Store<AppState>) {

    this.state$ = store.select(getUserState);

    this.sessionUser$ = store.select(getSessionUserData);

    this.authUserId$ = store.select(getAuthUserId);

  }


  loadUserData(id: string): Observable<User> {
    return this.db.object(`/users/${id}`)
      .map(it => it as UserEntity)
      .map(it => users.forEntity(it));
  }


  addSessionUserVote(pollId: string, voteId: string) {
    this.authUserId$.take(1).subscribe(id => {
      if (id == null) {
        console.info(`Session user is null, not persisting vote to user obj`);
        return;
      } else {
        console.info(`Persisting vote to user ${id}}`);
        this.db.object(`/users/${id}/votes`).update({ [pollId]: voteId })
      }
    });
  }

  addSessionUserPoll(pollId: string) {

    this.authUserId$.take(1).subscribe(id => {
      if (id == null) {
        //this should never happen anymore, as there should always be an anonymous user id
        console.info(`Auth user is null, not persisting vote to user obj`);
        return;
      } else {
        console.info(`Persisting poll to user ${id}}`);
        this.db.object(`/users/${id}/polls`).update({ [pollId]: true })
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
    this.db.object(`/users/${info.uid}`).update(users.forAuthInfo(info))
      .then((result) => console.info(`created user record for user ${info.displayName} (${info.uid})`))
      .catch(err => {throw err;});
  }

}
