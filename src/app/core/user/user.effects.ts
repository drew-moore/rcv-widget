import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {AuthActions, LoginSuccessAction, SignupSuccessAction, AuthInfo} from "../../auth/auth.state";
import {UserDataLoadedAction} from "./user.state";
import {User} from "./user.model";
import {VotesActions, VoteCastSuccessAction} from "../vote/votes.state";
import {UserService} from "./user.service";
import {PollsActions, PollCreatedAction} from "../poll/polls.state";
import {Store} from "@ngrx/store";
import {AppState} from "../../state";
import {Observable} from "rxjs";
import {CoreActions, SessionUserChangedAction} from "../state";

@Injectable()
export class UserEffects {

  newActiveUsers = Observable.merge(
    this.actions.ofType(AuthActions.PASSWORD_SIGNUP_SUCCESS),
    this.actions.ofType(AuthActions.LOGIN_SUCCESS)
  )
    .map(action => action as SignupSuccessAction|LoginSuccessAction)
    .map(toPayload)
    .filter(info => !info.anonymous);


  @Effect({ dispatch: false })
  verifyUserRecordsAgainstAuthData =
    this.newActiveUsers
      .map(user => this.userSvc.verifyRecordForAuthAccount(user));

  @Effect()
  syncSessionUserWithAuthInfo =
    Observable.merge(
      this.actions.ofType(AuthActions.PASSWORD_SIGNUP_SUCCESS),
      this.actions.ofType(AuthActions.LOGIN_SUCCESS)
    ).map(toPayload)
      .map((info: AuthInfo) => new SessionUserChangedAction(info.uid)
      );


  @Effect()
  loadSessionUserDataOnChanges =
    this.actions.ofType(CoreActions.SESSION_USER_CHANGED)
      .map(toPayload)
      .filter(it => !!it) //will be null when session user has been logged out
      .flatMap(id => this.userSvc.loadUserData(id))
      .filter(it => !!it) //will be null when this is their first login, data has not been created yet
      .map((data: User) => new UserDataLoadedAction(data));

  @Effect({ dispatch: false })
  saveVoteToUserObjectAfterCasting =
    this.actions.ofType(VotesActions.VOTE_CAST_SUCCESS)
      .map(action => action as VoteCastSuccessAction)
      .map(toPayload)
      .do(it => this.userSvc.addSessionUserVote(it.pollId, it.vote.id));

  @Effect({ dispatch: false })
  savePollToUserObjectAfterCasting =
    this.actions.ofType(PollsActions.POLL_CREATED)
      .map(action => action as PollCreatedAction)
      .map(toPayload)
      .do(it => this.userSvc.addSessionUserPoll(it.id));


  constructor(private actions: Actions, private userSvc: UserService, private store: Store<AppState>) {

  }


}
