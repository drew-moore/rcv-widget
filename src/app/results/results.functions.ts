import {keys} from "lodash";
import {PollOption} from "../core/poll/poll.models";
import {Vote} from "../core/vote/vote.models";
import {OptionStateSnapshot, PollOutcome, OptionOutcome, RoundState} from "./results.models";

const EXHAUSTED = 'EXHAUSTED';

type VoteDistribution = {
  [id: string]: Vote[]
} & {
  EXHAUSTED: Vote[]
}


export function computeRounds(pollOptions: PollOption[], votes: Vote[], removed: string[]): RoundState[] {

  let eliminated: string[] = [],
    nextElimination: string;

  let optMap: { [id: string]: PollOption } = pollOptions.reduce((result, opt) => Object.assign(result, { [opt.id]: opt }), {});

  let unremovedOptions = pollOptions.filter(opt => removed.indexOf(opt.id) < 0);

  let round = 0;
  let prevDistribution: VoteDistribution;
  let currDistribution: VoteDistribution;

  let activeVotes: Vote[];

  let inactiveVotes: Vote[] = [];

  let transfers: { [id: string]: number };

  let outcome: PollOutcome|false;


  let options: { [id: string]: OptionStateSnapshot };

  let rounds: RoundState[] = [];

  do {
    currDistribution = distribute(votes, [ ...removed, ...eliminated ]);
    activeVotes = getActiveVotes(currDistribution);
    inactiveVotes = currDistribution[ EXHAUSTED ];
    outcome = checkForOutcome(currDistribution);

    if (round > 0) {
      transfers = keys(currDistribution).reduce((result, next) => {
        return Object.assign(result, { [next]: currDistribution[ next ].length - prevDistribution[ next ].length })
      }, {});
    }


    options = pollOptions.reduce((result, option) => {
      let status: 'removed'|'eliminated'|'active';
      if (removed.indexOf(option.id) >= 0) {
        status = 'removed';
      } else if (eliminated.indexOf(option.id) >= 0) {
        status = 'eliminated';
      } else {
        status = 'active';
      }

      let votes = status == 'active' ? {
          count: currDistribution[ option.id ].length,
          outOf: activeVotes.length
        } : { count: 0, outOf: activeVotes.length };

      let toPut: OptionStateSnapshot = { status, votes };

      if (round > 0 && status == 'active') {
        if (transfers[ option.id ] > 0) {
          toPut.votesIn = {
            round,
            source: optMap[ eliminated[ eliminated.length - 1 ] ],
            count: transfers[ option.id ]
          }
        }
      }

      if (round > 0 && option.id == eliminated[ eliminated.length - 1 ]) {
        toPut.votesOut = keys(transfers).map(id => {
          return {
            round,
            target: optMap[ id ],
            count: transfers[ id ]
          }
        });
      }

      return Object.assign(result, { [option.id]: toPut });
    }, {});

    rounds.push({
      round, outcome, options, eliminated, votes: {
        active: activeVotes.length,
        inactive: inactiveVotes.length
      }
    });

    round++;
    eliminated = [ ...eliminated, lowestScorer(currDistribution) ];
    prevDistribution = currDistribution;

  } while (round < unremovedOptions.length - 1);


  return rounds;

}

function checkForOutcome(dist: VoteDistribution): PollOutcome|false {
  let numActiveVotes = getActiveVotes(dist).length,
    needed = Math.ceil(numActiveVotes / 2);
  let idsByScore = keys(dist).sort((x, y) => dist[ y ].length - dist[ x ].length);
  let hiScore = dist[ idsByScore[ 0 ] ].length;

  if (hiScore >= needed) {
    let id: string,
      currPlace = 1,
      currScore = hiScore,
      places: OptionOutcome[] = [];

    for (let i = 0; i < idsByScore.length; i++) {
      id = idsByScore[ i ];
      if (dist[ id ].length < currScore) {
        currPlace++;
        currScore = dist[ id ].length;
      }
      places.push({
        id: id,
        place: currPlace,
        score: dist[ id ].length,
        outOf: numActiveVotes
      });
    }

    return {
      activeVotes: numActiveVotes,
      places: places
    }


  } else {
    return false;
  }

}

function getActiveVotes(distribution: VoteDistribution) {
  return keys(distribution).filter(x => x !== EXHAUSTED).reduce((result, id) => result.concat(distribution[ id ]), [] as Vote[]);
}

function lowestScorer(dist: VoteDistribution): string {
  return keys(dist).filter(x => x !== EXHAUSTED).sort((x, y) => dist[ x ].length - dist[ y ].length)[ 0 ];
}

function distribute(votes: Vote[], removed: string[]): VoteDistribution {
  let initObj: VoteDistribution = { EXHAUSTED: [] };

  return votes.reduce((result, vote) => {
    let assignTo = assignVote(vote.choices, removed);
    if (!result[ assignTo ]) {
      result[ assignTo ] = [];
    }
    result[ assignTo ].push(vote);
    return result;
  }, initObj);
}


function assignVote(choices: string[], ignore: string[]) {
  for (let i = 0; i < choices.length; i++) {
    if (ignore.indexOf(choices[ i ]) < 0) {
      return choices[ i ];
    }
  }
  //if we get here, then the vote is exhausted (i.e. all choices specified have been eliminated) so we leave it with the last choice
  return EXHAUSTED;
}
