import { DomainEvent, EventPayload } from '../../service/DomainEvent';

export abstract class AbstractEvent implements DomainEvent {
  private readonly firedAt = new Date();

  public get FiredAt(): Date {
    return this.firedAt;
  }

  public abstract get Name(): string;
  public abstract get Payload(): Readonly<EventPayload>;
}
