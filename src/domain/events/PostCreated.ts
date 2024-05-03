import { AbstractEvent } from './AbstractEvent';
import { PostId } from '../value_objects/PostId';
import { PostTitle } from '../value_objects/PostTitle';
import { EventPayload } from '../../service/DomainEvent';
import { PostContent } from '../value_objects/PostContent';

export class PostCreated extends AbstractEvent {

  public constructor(
    private readonly id: PostId,
    private readonly title: PostTitle,
    private readonly content: PostContent,
  ) {
    super();
  }

  public get Name(): string {
    return 'com.herrdoktor.events.blog.PostCreated';
  }

  public get Payload(): Readonly<EventPayload> {
    return {
      id: this.id.asNumber(),
      title: this.title.asString(),
      content: this.content.asString(),
    };
  }
}
