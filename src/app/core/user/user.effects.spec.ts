/* tslint:disable:no-unused-variable */
import {inject} from "@angular/core/testing";
import {UserEffects} from "./user.effects";
import {EffectsRunner} from "@ngrx/effects/testing";

describe('UserEffects', () => {
  let runner: EffectsRunner;
  let userEffects: UserEffects;

  beforeEach(inject([
      EffectsRunner, UserEffects
    ],
    (_runner: EffectsRunner, _userEffects: UserEffects) => {
      runner = _runner;
      userEffects = _userEffects;
    }
  ));

  it('should ...', inject([ UserEffects ], (service: UserEffects) => {
    expect(service).toBeTruthy();
  }));


});
