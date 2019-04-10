import { Chainable } from 'cypress';

declare global {
  declare namespace Cypress {
    type MatchImageSnapshot = (arg?: undefined | string) => void;
    export interface Chainable<Subject = any> {
      matchImageSnapshot: MatchImageSnapshot;
    }
  }
}
