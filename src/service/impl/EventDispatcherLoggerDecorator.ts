import { DomainEvent } from '../DomainEvent';
import { EventDispatcher } from '../EventDispatcher';
import { Logger } from '@nestjs/common';

export class EventDispatcherLoggerDecorator extends EventDispatcher {
  public constructor(
    private readonly innerDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) {
    super();
  }

  private logEvents(events: readonly DomainEvent[]): void {
    for (const event of events) {
      this.logger.log(`[EventDispatcher] Dispatching event ${event.Name}`);
    }
  }

  public async dispatch(events: DomainEvent|readonly DomainEvent[]): Promise<void> {
    if (Array.isArray(events)) {
      this.logEvents(events);
    } else {
      this.logEvents([events as DomainEvent]);
    }

    return this.innerDispatcher.dispatch(events);
  }
}
