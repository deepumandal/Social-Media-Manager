import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type Platform = "linkedin" | "twitter" | "facebook" | "instagram";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @Column("text")
  postId!: string;

  @Column({
    type: "enum",
    enum: ["linkedin", "twitter", "facebook", "instagram"],
  })
  platform!: Platform;

  @Column({ type: "datetime" })
  scheduledAt!: Date;

  @Column({
    type: "enum",
    enum: ["draft", "scheduled", "published", "failed"],
    default: "draft",
  })
  status!: PostStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export interface CreatePostData {
  postId: string;
  content: string;
  platform: Platform;
  scheduledAt: Date;
}

export interface UpdatePostData {
  content?: string;
  platform?: Platform;
  scheduledAt?: Date;
}
