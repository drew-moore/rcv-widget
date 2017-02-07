import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {AuthActions, LoginSuccessAction} from "../../auth/auth.state";
import {SessionUserChangedAction, UserActions, UserDataLoadedAction} from "./user.state";
import {User} from "./user.model";
import {VotesActions, VoteCastSuccessAction} from "../vote/votes.state";
import {UserService} from "./user.service";
import {PollsActions, PollCreatedAction} from "../poll/polls.state";

@Injectable()
export class UserEffects {

  @Effect({ dispatch: false })
  createUserObjectOnSignupEffect =
    this.actions.ofType(AuthActions.PASSWORD_SIGNUP_SUCCESS);

  @Effect()
  setSessionUserOnLogins =
    this.actions.ofType(AuthActions.LOGIN_SUCCESS)
      .map(action => new SessionUserChangedAction((action as LoginSuccessAction).payload.id));

  @Effect()
  setSessionUserOnLogouts =
    this.actions.ofType(AuthActions.LOGOUT_SUCCESS)
      .map(action => new SessionUserChangedAction(null));


  @Effect()
  loadSessionUserDataOnChanges =
    this.actions.ofType(UserActions.SESSION_USER_CHANGED)
      .map(toPayload)
      .filter(it => !!it)
      .flatMap(id => this.userSvc.loadUserData(id))
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


  constructor(private actions: Actions, private userSvc: UserService) {

  }


}
