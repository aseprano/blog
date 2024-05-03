import { AbstractEvent } from './AbstractEvent';
import { EventPayload } from '../../service/DomainEvent';
import { PostId } from '../value_objects/PostId';
import { CategoryId } from '../value_objects/CategoryId';

export class PostBoundToCategory extends AbstractEvent {
  public constructor(
    private readonly id: PostId,
    private readonly category: CategoryId,
  ) {
    super();
  }

  public get Name(): string {
    return 'com.herrdoktor.events.blog.PostBoundToCategory';
  }

  public get Payload(): Readonly<EventPayload> {
    return {
      id: this.id.asNumber(),
      category_id: this.category.asNumber(),
    };
  }
}
