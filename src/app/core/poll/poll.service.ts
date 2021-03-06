import {Injectable} from "@angular/core";
import * as moment from "moment";
import {AngularFireDatabase} from "angularfire2";
import {Store} from "@ngrx/store";
import {AppState, getPollsState, getActivePoll} from "../../state";
import {
  PartialPoll,
  SerializablePoll,
  PartialPollOption,
  SerializablePollOption,
  Poll,
  PollEntity
} from "./poll.models";
import * as polls from "./poll.functions";
import {REQUIRED_POLL_FIELDS, REQUIRED_POLL_OPTION_FIELDS} from "./poll.functions";
import {Observable, Observer} from "rxjs";
import {PushResult} from "../_internal";
import {PollsState, LoadPollAction} from "./polls.state";
import {UserService} from "../user/user.service";

@Injectable()
export class PollService {

  public readonly state$: Observable<PollsState>;

  public readonly activePoll$: Observable<Poll>;

  constructor(private db: AngularFireDatabase, private store: Store<AppState>, private userSvc: UserService) {
    this.state$ = store.select(getPollsState);

    this.activePoll$ = store.select(getActivePoll).filter(it => !!it);

  }

  public loadPoll(id: string): Observable<Poll> {

    this.state$.take(1).do(state => {
      if (state.ids.indexOf(id) < 0) {
        this.store.dispatch(new LoadPollAction(id))
      }
    });

    return this.state$.map(state => state.entities[ id ]);


  }

  observePollEntity(id: string): Observable<PollEntity> {
    return this.db.object(`/polls/${id}`)
      .map(it => it as PollEntity);
  }


  public createPoll(input: PartialPoll): Observable<Poll> {
    return Observable.create((observer: Observer<Poll>) => {

      this.userSvc.sessionUser$.take(1).subscribe(user => {
        if (user == null) {
          observer.error({
            code: 401,
            message: 'User must be authenticated to create a forAny.'
          })
        } else {
          let data = prepareSerializablePoll(input, user.id);
          this.db.list(`/polls`, { preserveSnapshot: true }).push(data)
            .then((result: PushResult) => {
                this.observePollEntity(result.key).take(1).subscribe((it: PollEntity) => {
                  let toReturn = polls.forEntity(it);
                  if (toReturn == null) {
                    return observer.error({
                      code: 400,
                      message: `Invalid response returned from push to /polls: ${JSON.stringify(it)}`
                    })
                  } else {
                    return observer.next(toReturn);
                  }
                });
              }
            ).catch(err => {
            return observer.error(err);
          })
        }
      })

    }).take(1);
  }


}


function prepareSerializablePoll(it: PartialPoll, ownerId: string, sanitize: boolean = true): SerializablePoll {
  if (sanitize) {
    REQUIRED_POLL_FIELDS.forEach(field => {
      if (it[ field ] == undefined) {
        throw `Cannot serialize input as Poll: Required field ${field} is missing on input value: ${JSON.stringify(it)}`
      }
    });
  }

  let created: string = it.created ? it.created.toISOString() : moment().toISOString();

  let options = it.options.reduce((result, option, idx) =>
      Object.assign(result, { [option.id || `undefined_${idx}`]: prepareSerializalePollOption(option, sanitize) }),
    {}
  );

  let toReturn: SerializablePoll = {
    prompt: it.prompt,
    options: options,
    security: it.security,
    published: it.published,
    created: created,
    owner: ownerId,
    expires: it.expires,
    status: it.status
  };

  if (!!it.expiration) {
    toReturn.expiration = it.expiration.toISOString();
  }

  return toReturn;

}


function prepareSerializalePollOption(it: PartialPollOption, sanitize: boolean = true): SerializablePollOption {
  REQUIRED_POLL_OPTION_FIELDS.forEach(field => {
    if (it[ field ] == undefined) {
      throw `Cannot serialize input as PollOption: Required field ${field} is missing on input value: ${JSON.stringify(it)}`
    }
  });
  let toReturn: SerializablePollOption = {
    text: it.text,
    color: it.color
  };

  if (it.image) {
    toReturn.image = it.image;
  }

  return toReturn;
}
