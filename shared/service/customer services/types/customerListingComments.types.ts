export interface CommentUser {
  uuid: string;
  full_name: string;
}

export interface CommentReply {
  uuid: string;
  user: CommentUser;
  comment: string;
  created_at: string;
  edited: boolean;
  deleted: boolean;
}

export interface ListingComment {
  uuid: string;
  user: CommentUser;
  comment: string;
  created_at: string;
  edited: boolean;
  deleted: boolean;
  replies: CommentReply[];
}

export interface CreateCommentPayload {
  comment: string;
  parent?: string | null;
}

export interface CreateCommentArgs {
  listingUuid: string;
  payload: CreateCommentPayload;
}

export interface UpdateCommentPayload {
  comment: string;
}

export interface UpdateCommentArgs {
  listingUuid: string;
  commentUuid: string;
  payload: UpdateCommentPayload;
}

export interface DeleteCommentArgs {
  listingUuid: string;
  commentUuid: string;
}