import {Injectable} from "@angular/core";
import {createSelector} from "reselect";
import * as moment from "moment";
import {AngularFireDatabase} from "angularfire2";
import {Store} from "@ngrx/store";
import {AppState, getVotesState, getVoteEntities, getVotesForActivePoll} from "../../state";
import {Observable, Observer} from "rxjs";
import {VotesState, CastVoteAction, VoteCastSuccessAction, VotesActions} from "./votes.state";
import {Vote, PartialVote, SerializableVote, VoteEntity} from "./vote.models";
import {AuthService} from "../../auth/auth.service";
import * as votes from "./vote.functions";
import {PollService} from "../poll/poll.service";
import {PushResult} from "../_internal";
import {Actions, toPayload} from "@ngrx/effects";
import {UserService} from "../user/user.service";

@Injectable()
export class VoteService {

  private state$: Observable<VotesState>;

  public readonly activePollVotes$: Observable<Vote[]>;

  constructor(private db: AngularFireDatabase, private store: Store<AppState>, private authSvc: AuthService, private pollSvc: PollService, private actions: Actions, private userSvc: UserService) {
    this.state$ = store.select(getVotesState);
    this.activePollVotes$ = store.select(getVotesForActivePoll).filter(it => !!it);
  }


  public castVote(vote: PartialVote, pollId: string) {
    this.store.dispatch(new CastVoteAction(vote, pollId));

    //TODO think this (unconventional?) approach through. We emit an action, then wait on
    //This wouldn't work, e.g. if a user cast multiple votes simultaneously

    return this.actions.ofType(VotesActions.VOTE_CAST_SUCCESS)
      .take(1)
      .map(action => action as VoteCastSuccessAction)
      .map(toPayload);

  }

  doCastVote(vote: PartialVote, pollId: string): Observable<Vote> {


    /*
     return Observable.combineLatest(this.authSvc.sessionUserId$.take(1), this.pollSvc.loadPoll(pollId).take(1)).flatMap(([userId, poll]) => {
     let voterId: string;
     if (userId == null){
     if (poll.security !== 'anonymous'){

     }
     }

     });*/

    return Observable.create((observer: Observer<Vote>) => {
      Observable.combineLatest(this.userSvc.sessionUser$.take(1), this.pollSvc.loadPoll(pollId).take(1)).subscribe(([ user, poll ]) => {
        let voterId: string;

        //ensure the current user has the right to cast a vote
        switch (poll.security) {
          case 'verified':
            if (user == null) {
              return observer.error({
                code: 401,
                message: `Poll security is set to VERIFIED, but no auth user exists.`
              })
            } else if (user.isVerified == false) {
              return observer.error({
                code: 402,
                message: `Poll security is set to VERIFIED, but the current user does not have a verified account.`
              })
            } else {
              voterId = user.id;
            }
            break;
          case 'unverified':
            if (user == null) {
              /*              return observer.error({
                code: 401,
                message: `Poll security is set to UNVERIFIED, but no auth user exists.`
               })*/
              voterId = 'anon';
            } else {
              voterId = user.id;
            }
            break;
          case 'anonymous':
            if (user == null) {
              voterId = 'anon';
            } else {
              voterId = user.id;
            }
            break;
          default:
            //needed to convince TS that voterId is initialized.
            throw `Poll has invalid security setting: ${poll.security}`;
        }

        //ensure the choices given in the vote are valid
        let validOptionIds = poll.options.map(opt => opt.id);
        vote.choices.forEach((choice, idx) => {
          if (validOptionIds.indexOf(choice) < 0) {
            return observer.error({
              code: 400,
              message: `Choice ${choice} at index ${idx} is not valid, as it does not match the any of the following options: ${JSON.stringify(validOptionIds)}`
            });
          }
        });

        let toPush = prepareSerializableVote(vote, voterId);

        this.db.list(`/votes/${pollId}`).push(toPush).then((result: PushResult) => {
          //strictly speaking, we should observe the vote...
          let toReturn: Vote = votes.forAny(Object.assign({}, toPush, { id: result.key }));
          return observer.next(votes.forAny(toReturn));
        }).catch(err => {
          return observer.error(err);
        })

      });

    }).take(1);
  }

  observePollVotes(id: string): Observable<Vote[]> {
    return this.db.list(`/votes/${id}`)
      .map(list => list.map((it: VoteEntity) => votes.forEntity(it)).filter((it: Vote|undefined) => {
        if (it == undefined) {
          console.log('undefined');
          console.log(it);
          debugger;
        }
        return !!it;
      }));
  }


  public loadSingleVote(pollId: string, voteId: string): Observable<Vote> {

    let selector = createSelector(getVoteEntities, (votes) => votes[ voteId ]);

    return this.store.select(selector);
  }


}

function prepareSerializableVote(vote: PartialVote, ownerId: string): SerializableVote {

  let castString = !!vote.cast ? vote.cast.toISOString() : moment().toISOString();

  return {
    choices: vote.choices,
    owner: ownerId,
    cast: castString,
    published: vote.published || false
  }
}
