/**
 * ColorFYI API client — TypeScript wrapper for colorfyi.com REST API.
 *
 * Zero dependencies. Uses native `fetch`.
 *
 * @example
 * ```ts
 * import { ColorFYI } from "colorfyi";
 * const api = new ColorFYI();
 * const items = await api.search("query");
 * ```
 */

/** Generic API response type. */
export interface ApiResponse {
  [key: string]: unknown;
}

export class ColorFYI {
  private baseUrl: string;

  constructor(baseUrl = "https://colorfyi.com") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async get<T = ApiResponse>(
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  }

  // -- Endpoints ----------------------------------------------------------

  /** List all brands. */
  async listBrands(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/brands/", params);
  }

  /** Get brand by slug. */
  async getBrand(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/brands/${slug}/`);
  }

  /** List all collections. */
  async listCollections(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/collections/", params);
  }

  /** Get collection by slug. */
  async getCollection(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/collections/${slug}/`);
  }

  /** List all colors. */
  async listColors(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/colors/", params);
  }

  /** Get color by slug. */
  async getColor(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/colors/${slug}/`);
  }

  /** List all faqs. */
  async listFaqs(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/faqs/", params);
  }

  /** Get faq by slug. */
  async getFaq(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/faqs/${slug}/`);
  }

  /** List all glossary. */
  async listGlossary(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/glossary/", params);
  }

  /** Get term by slug. */
  async getTerm(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/glossary/${slug}/`);
  }

  /** List all posts. */
  async listPosts(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/posts/", params);
  }

  /** Get post by slug. */
  async getPost(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/posts/${slug}/`);
  }

  /** Search across all content. */
  async search(query: string, params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/search/", { q: query, ...params });
  }
}
