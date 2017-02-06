import * as moment from "moment";
import * as Faker from "faker";
import {random, shuffle, range} from "lodash";
import {Vote} from "./vote/vote.models";
import {PollOption, Poll} from "./poll/poll.models";


let lastId = 0;
function mockId(type?: string): string {
  return `mock_${type || 'mockId'}_${++lastId}`;
}


const COLORS = [
  "#5C6BC0",
  "#EF5350",
  "#43A047",
  "#7E57C2",
  "#FF8A65",
  "#8D6E63",
  "#F06292",
  "#FDD835",
  "#3ba9c4",
  "#81C784",
  "#868086",
  '#00796B',
  '#D84315',
  '#1B5E20',
  '#FFE57F',
  "#76FF03",
  '#424242',
  "#D500F9",
  "#6D4C41",
  "#D50000",

];

let lastColorReturned = -1;

function color(): string {
  return COLORS[ ++lastColorReturned % COLORS.length ];
}

export function mockVoteWithChoices(choices: string[]): Vote {
  return {
    id: mockId('vote'),
    owner: mockId('user'),
    choices: choices,
    published: false,
    cast: moment()
  }
}

export function mockVote(availableChoices: string[]): Vote {
  let numChoices = random(1, availableChoices.length),
    shuffled = shuffle(availableChoices);
  return {
    id: mockId('vote'),
    owner: mockId('user'),
    choices: shuffled.slice(0, numChoices),
    published: false,
    cast: moment()
  }
}

export function mockVotesForPoll(poll: Poll): Vote[] {
  let numVotes = random(100, 300);
  let ids = poll.options.map(opt => opt.id);
  return range(0, numVotes).map(() => mockVote(ids));
}

export function mockPollOption(): PollOption {

  let name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;


  return {
    id: mockId(),
    text: name,
    color: color()
  };
}

export function mockPoll(): Poll {

  let numOptions = random(5, 8),
    options: PollOption[] = [];

  for (let i = 0; i < numOptions; i++) {
    options[ i ] = mockPollOption();
  }

  let optionIds = options.map(opt => opt.id);

  return {
    prompt: `Who should ${Faker.lorem.sentence().toLowerCase().slice(0, -1)}?`,
    id: mockId('poll'),
    options: options,
    status: 'open',
    security: 'unverified',
    created: moment(),
    published: true,
    expires: false,
    owner: mockId('user')
  }

}
