import { BlogPost } from '../../aggregates/BlogPost';
import { PostId } from '../../value_objects/PostId';
import { BlogPostsRepository } from '../BlogPostsRepository';
import { PostTitle } from '../../value_objects/PostTitle';
import { BlogPostNotFoundException } from '../../exceptions/BlogPostNotFoundException';
import { PictureUrl } from '../../value_objects/PictureUrl';
import { CategoryId } from '../../value_objects/CategoryId';
import { TagList } from '../../value_objects/TagList';
import { PostContent } from '../../value_objects/PostContent';
import { DBConnection } from '../../../service/impl/DBConnection';
import { VersionMismatchException } from '../../exceptions/VersionMismatchException';
import { DBTransaction } from '../../../service/impl/DBTransaction';

export class MySQLPostsRepository implements BlogPostsRepository {
  public constructor(private readonly conn: DBConnection) {}

  private insertTags(
    tags: TagList,
    idPost: number,
    tx: DBTransaction,
  ): Promise<void> {
    const values = [];
    const tuples: string[] = [];

    for (const tag of tags.items) {
      tuples.push('(?, ?)');
      values.push(idPost, tag.asString());
    }

    const allTuples = tuples.join(',');
    const sql = `INSERT INTO post_tags (id_post, tag) VALUES ${allTuples}`;

    return tx.query(sql, values);
  }

  public async getById(id: PostId): Promise<BlogPost> {
    const posts = await this.conn.query('SELECT * FROM posts WHERE id = ?', [
      id.asNumber(),
    ]);

    if (!posts.length) {
      throw new BlogPostNotFoundException();
    }

    const post = posts[0];

    const tags = await this.conn.query(
      'SELECT `tag` FROM `post_tags` WHERE `id_post` = ?',
      [id.asNumber()],
    );

    return new BlogPost(
      id,
      {
        title: new PostTitle(post.title),
        content: new PostContent(post.content),
        pictureUrl: new PictureUrl(post.picture_url),
        category: new CategoryId(post.id_category),
        tags: TagList.parse(tags.map((row: any) => row.tag)),
      },
      post.version,
    );
  }

  public async add(post: BlogPost): Promise<PostId> {
    const tx = await this.conn.beginTransaction();

    try {
      const result = await tx.query(
        'INSERT INTO posts (title, content, picture_url, id_category, version) VALUES (?, ?, ?, ?, ?)',
        [
          post.Title.asString(),
          post.Content.asString(),
          post.PictureUrl.asString(),
          post.Category.asNumber(),
          post.Version,
        ],
      );

      const newId: number = result.insertId;
      await this.insertTags(post.TagList, newId, tx);
      await tx.commit();

      return new PostId(newId);
    } catch (err: any) {
      await tx.rollback();
      throw err;
    }
  }

  public async update(post: BlogPost): Promise<void> {
    const tx = await this.conn.beginTransaction();

    try {
      const result = await tx.query(
        'UPDATE posts SET title = ?, content = ?, picture_url = ?, id_category = ?, version = version + 1 WHERE id = ? AND version = ?',
        [
          post.Title.asString(),
          post.Content.asString(),
          post.PictureUrl.asString(),
          post.Category.asNumber(),
          post.Id.asNumber(),
          post.Version,
        ],
      );

      if (!result.affectedRows) {
        throw new VersionMismatchException(
          `Version mismatch for blog post ${post.Id}`,
        );
      }

      await tx.query('DELETE FROM post_tags WHERE id_post = ?', [
        post.Id.asNumber(),
      ]);

      await this.insertTags(post.TagList, post.Id.asNumber(), tx);
      await tx.commit();
    } catch (error: any) {
      await tx.rollback();
      throw error;
    }
  }

  public async delete(id: PostId): Promise<void> {
    const result = await this.conn.query('DELETE FROM posts WHERE id = ?', [
      id.asNumber(),
    ]);

    if (!result.affectedRows) {
      throw new BlogPostNotFoundException(`Post not found: ${id.asNumber()}`);
    }
  }
}
