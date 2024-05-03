import { DomainEvent } from './DomainEvent';

export abstract class EventDispatcher {
  abstract dispatch(event: DomainEvent | readonly DomainEvent[]): Promise<void>;
}
