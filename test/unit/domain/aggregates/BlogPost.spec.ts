import { BlogPost } from '../../../../src/domain/aggregates/BlogPost';
import { PostId } from '../../../../src/domain/value_objects/PostId';
import { PostTitle } from '../../../../src/domain/value_objects/PostTitle';
import { PostContent } from '../../../../src/domain/value_objects/PostContent';
import { CategoryId } from '../../../../src/domain/value_objects/CategoryId';
import { TagList } from '../../../../src/domain/value_objects/TagList';
import { Tag } from '../../../../src/domain/value_objects/Tag';
import { PictureUrl } from '../../../../src/domain/value_objects/PictureUrl';

describe('BlogPost', () => {
  it('Can be instantiated with its id, properties and version', () => {
    const post = new BlogPost(
      new PostId(123), {
        title: new PostTitle('This is a title'),
        content: new PostContent('Lorem ipsum dolor sit amet'),
        pictureUrl: new PictureUrl('https://www.flickr.com/herr-doktor/image.png'),
        category: new CategoryId(100),
        tags: TagList.parse(['random']),
      },
      10,
    );

    expect(post.Id).toEqual(new PostId(123));
    expect(post.Title.asString()).toEqual('This is a title');
    expect(post.Content.asString()).toEqual('Lorem ipsum dolor sit amet');
    expect(post.PictureUrl.asString()).toEqual('https://www.flickr.com/herr-doktor/image.png');
    expect(post.Category.asNumber()).toEqual(100);
    expect(post.TagList.items).toEqual([new Tag('random')]);
    expect(post.Version).toEqual(10);
  });

  it('Can be updated with new properties', () => {
    const post = new BlogPost(
      new PostId(111),
      {
        title: new PostTitle('This is another title'),
        content: new PostContent('Lorem ipsum dolor sit amet'),
        pictureUrl: new PictureUrl('https://www.flickr.com/herr-doktor/image.png'),
        category: new CategoryId(101),
        tags: TagList.parse(['random', 'physics']),
      },
      12,
    );

    // Only update some properties
    post.updateProperties({
      title: new PostTitle('A post about physics'),
      content: new PostContent('We went to the Moon, not because it was easy but because it was hard'),
    });

    // Expect those properties to have been updated
    expect(post.Title.asString()).toEqual('A post about physics');
    expect(post.Content.asString()).toEqual('We went to the Moon, not because it was easy but because it was hard');

    // Expect any other property to have been not updated
    expect(post.Category.asNumber()).toEqual(101);
    // ...
  });

  it('Can be partially updated', () => {
    const blogPost = new BlogPost(
      new PostId(111),
      {
        title: new PostTitle('Another brick in the wall'),
        content: new PostContent("We don't need no education"),
        pictureUrl: new PictureUrl('https://www.flickr.com/herr-doktor/image.png'),
        category: new CategoryId(101),
        tags: TagList.parse(['songs', 'lyrics']),
      },
      42,
    );

    blogPost.updateProperties({
      title: undefined,
      pictureUrl: new PictureUrl('https://www.flickr.com/herr-doktor/image2.png'),
    });

    expect(blogPost.Title.asString()).toEqual('Another brick in the wall');
    expect(blogPost.Content.asString()).toEqual("We don't need no education");
    expect(blogPost.PictureUrl.asString()).toEqual('https://www.flickr.com/herr-doktor/image2.png');
    expect(blogPost.Category.asNumber()).toEqual(101);
    expect(blogPost.TagList.items).toEqual([
      new Tag('songs'),
      new Tag('lyrics'),
    ]);
  });
});
