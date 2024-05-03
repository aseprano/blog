export type EventPayload = {
  [key: string]: any;
}

export interface DomainEvent {
  get Name(): string;
  get Payload(): Readonly<EventPayload>;
  get FiredAt(): Date;
}
