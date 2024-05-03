import { AbstractEvent } from './AbstractEvent';
import { EventPayload } from '../../service/DomainEvent';
import { PostId } from '../value_objects/PostId';
import { TagList } from '../value_objects/TagList';

export class TagsAddedToPost extends AbstractEvent {
  public constructor(
    private readonly id: PostId,
    private readonly tags: TagList,
  ) {
    super();
  }

  public get Name(): string {
    return 'com.herrdoktor.events.blog.TagsAddedToPost';
  }

  public get Payload(): Readonly<EventPayload> {
    return {
      id: this.id.asNumber(),
      tags: this.tags.items.map((tag) => tag.asString()),
    };
  }
}
