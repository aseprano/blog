import { Queryable } from '../../service/Queryable';
import { BlogPostNotFoundException } from '../exceptions/BlogPostNotFoundException';

export interface SearchParams {
  readonly title?: string;
  readonly category?: string;
  readonly tag?: string;
}

export interface BlogPostDTO {
  readonly id: number;
  readonly title: string;
  readonly picture_url: string,
  readonly content: string;
  readonly category: {
    readonly id: number;
    readonly label: string;
  };
  readonly tags?: readonly string[];
}

export interface BlogSearchResultItem {
  readonly id: number;
  readonly title: string;
  readonly picture_url: string,
  readonly content: string;
}

export interface BlogSearchResult {
  readonly posts: readonly BlogSearchResultItem[];
}

export class BlogSearchService {
  public constructor(
    private readonly conn: Queryable,
  ) {
  }

  public async getPost(id: number): Promise<BlogPostDTO> {
    const posts = await this.conn.query(`SELECT p.*, c.label FROM posts p INNER JOIN categories c ON c.id = p.id_category WHERE p.id = ?`, [id]);

    if (!posts.length) {
      throw new BlogPostNotFoundException();
    }

    const row = posts[0];

    const tags = await this.conn.query(`SELECT tag FROM post_tags WHERE id_post = ?`, [id]);

    return {
      id,
      title: row.title,
      content: row.content,
      picture_url: row.picture_url,
      category: {
        id: row.id_category,
        label: row.label,
      },
      tags: tags.map((row: any) => row.tag),
    };
  }

  public async search(params: SearchParams): Promise<BlogSearchResult> {
    let sql = 'SELECT p.* FROM posts p';
    const queryParams = [];

    if (params.tag) {
      sql += ' INNER JOIN post_tags t ON t.id_post = p.id AND t.tag = ?';
      queryParams.push(params.tag);
    }

    if (params.category) {
      sql += ' INNER JOIN categories c ON p.id_category = c.id AND c.label = ?';
      queryParams.push(params.category);
    }

    if (params.title) {
      sql += ' WHERE p.title LIKE ?';
      queryParams.push(`%${params.title}%`);
    }

    sql += ` ORDER BY p.id ASC`;

    const rows = await this.conn.query(sql, queryParams);

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      picture_url: row.picture_url,
    }));
  }
}
