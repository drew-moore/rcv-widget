import {keys, values, random} from "lodash";
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

  let optMap: { [id: string]: PollOption } = pollOptions.reduce((result, opt) => Object.assign(result, { [opt.id]: opt }), {}),
    optionIds = pollOptions.map(opt => opt.id);


  let unremovedOptions = pollOptions.filter(opt => removed.indexOf(opt.id) < 0);

  let round = 0;
  let prevDistribution: VoteDistribution;
  let currDistribution: VoteDistribution;

  let activeVotes: Vote[];

  let inactiveVotes: Vote[] = [];

  let transfers: { [id: string]: number };
  let totalTransfersOut: number = 0;

  let outcome: PollOutcome|false;
  let winners: string[] = [];

  let options: { [id: string]: OptionStateSnapshot };

  let rounds: RoundState[] = [];

  do {
    currDistribution = distribute(votes, optionIds, [ ...removed, ...eliminated ]);
    activeVotes = getActiveVotes(currDistribution);
    inactiveVotes = currDistribution[ EXHAUSTED ];
    outcome = checkForOutcome(currDistribution);
    if (!!outcome) {
      winners = outcome.places.filter(entry => entry.place == 1).map(entry => entry.id);
    }

    if (round > 0) {
      transfers = keys(currDistribution)
        .filter(id => eliminated.indexOf(id) < 0 && removed.indexOf(id) < 0)
        .reduce((result, next) => {
        return Object.assign(result, { [next]: currDistribution[ next ].length - prevDistribution[ next ].length })
      }, {});
      totalTransfersOut = values(transfers).reduce((sum, next) => sum + next, 0)
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


      let toPut: OptionStateSnapshot = {
        status,
        votes,
        outcome: !!outcome ? winners.indexOf(option.id) >= 0 ? 'won' : 'lost' : null
      };

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
    eliminated = [ ...eliminated, lowestScorer(currDistribution, [ ...removed, ...eliminated ]) ];
    prevDistribution = currDistribution;

  } while (round < unremovedOptions.length - 1);

  if (!rounds[ rounds.length - 1 ].outcome) {
    debugger;
    checkForOutcome(currDistribution);
  }

  return rounds;

}

function checkForOutcome(dist: VoteDistribution): PollOutcome|false {
  let numActiveVotes = getActiveVotes(dist).length,
    needed = Math.ceil(numActiveVotes / 2);
  let idsByScore = keys(dist).filter(x => x !== EXHAUSTED).sort((x, y) => dist[ y ].length - dist[ x ].length);
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

function lowestScorer(dist: VoteDistribution, ignore: string[]): string {
  let idsByScoreAsc = keys(dist)
    .filter(id => id !== EXHAUSTED && ignore.indexOf(id) < 0)
    .sort((x, y) => dist[ x ].length - dist[ y ].length);
  let lowScore = dist[ idsByScoreAsc[ 0 ] ].length;
  let lowScorers = idsByScoreAsc.filter(id => dist[ id ].length == lowScore);

  if (lowScorers.length > 1) {
    return lowScorers[ random(0, lowScorers.length - 1) ]
  } else {
    return lowScorers[ 0 ];
  }
}

function distribute(votes: Vote[], options: string[], removed: string[]): VoteDistribution {
  let initObj: VoteDistribution =
    options.reduce((result, id) => Object.assign(result, { [id]: [] as Vote[] }), { EXHAUSTED: [] });

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
