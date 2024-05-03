import { DomainEvent } from '../DomainEvent';
import { EventDispatcher } from '../EventDispatcher';

export class NullEventDispatcher extends EventDispatcher {
  dispatch(event: DomainEvent): Promise<void>;
  dispatch(events: readonly DomainEvent[]): Promise<void>;

  public async dispatch(events: unknown): Promise<void> {
  }
}
