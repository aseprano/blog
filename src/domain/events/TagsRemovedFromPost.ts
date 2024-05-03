import { AbstractEvent } from './AbstractEvent';
import { PostId } from '../value_objects/PostId';
import { TagList } from '../value_objects/TagList';
import { EventPayload } from '../../service/DomainEvent';

export class TagsRemovedFromPost extends AbstractEvent {
  public constructor(
    private readonly id: PostId,
    private readonly tags: TagList,
  ) {
    super();
  }

  public get Name(): string {
    return 'com.herrdoktor.events.blog.TagsRemovedFromPost';
  }

  public get Payload(): Readonly<EventPayload> {
    return {
      id: this.id.asNumber(),
      tags: this.tags.items.map((tag) => tag.asString()),
    };
  }
}
