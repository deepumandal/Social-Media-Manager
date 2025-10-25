import { BaseService } from "./initDB";
import { CreatePostData, Platform, Post, UpdatePostData } from "../entity/Post";

export class PostService extends BaseService<Post> {
  constructor() {
    super(Post);
  }
  async getPostById(postId: string, platform: Platform) {
    await this.initRepository();
    return this.repository.findOne({ where: { postId, platform } });
  }

  async createPost(post: CreatePostData) {
    await this.initRepository();

    const postId = post.postId;
    const platform = post.platform;

    const existingPost = await this.repository.findOne({
      where: { postId, platform },
    });

    if (existingPost) {
      throw new Error("Post already exists");
    }
    const newPost = this.repository.create(post);
    return this.repository.save(newPost);
  }

  async getAllPosts() {
    await this.initRepository();
    return this.repository.find();
  }

  async updatePost(postId: string, post: UpdatePostData) {
    await this.initRepository();
    return this.repository.update({ postId, platform: post.platform }, post);
  }
}
