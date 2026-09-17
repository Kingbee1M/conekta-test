'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import {
  useGetListingCommentsQuery,
  useCreateListingCommentMutation,
  useUpdateListingCommentMutation,
  useDeleteListingCommentMutation,
} from '@/shared/service/customer services/customerListingComments.services';
import {
  setActiveReply,
  setActiveEdit,
  clearCommentUiState,
} from '@/shared/store/customerListingCommentsSlice';
import {
  LuSend,
  LuReply,
  LuTrash2,
  LuX,
  LuChevronDown,
  LuChevronUp,
} from 'react-icons/lu';

import { AlertTriangle, Edit2 } from 'lucide-react';
import {
  ListingComment,
  CommentReply,
} from '@/shared/service/customer services/types/customerListingComments.types';
import { useToast } from './ui/ToastProvider';

type CommentsApiResponse =
  | ListingComment[]
  | { data?: ListingComment[]; comments?: ListingComment[] }
  | undefined;

interface CustomerCommentsProps {
  listingUuid: string;
}

export default function CustomerComments({ listingUuid }: CustomerCommentsProps) {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [commentInput, setCommentInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Confirmation Modal State
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);

  // UI state from slice
  const { activeReply, activeEdit } = useSelector(
    (state: RootState) => state.customerListingComments
  );

  // RTK Query endpoints
  const { data: rawComments, isLoading, isError } = useGetListingCommentsQuery(listingUuid);
  const [createComment, { isLoading: isCreating }] = useCreateListingCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateListingCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteListingCommentMutation();

  const commentsResponse = rawComments as CommentsApiResponse;
  const commentList: ListingComment[] = Array.isArray(commentsResponse)
    ? commentsResponse
    : Array.isArray(commentsResponse?.data)
    ? commentsResponse.data
    : Array.isArray(commentsResponse?.comments)
    ? commentsResponse.comments
    : [];

  const toggleReplies = (commentUuid: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentUuid]: !prev[commentUuid],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      if (activeEdit) {
        await updateComment({
          listingUuid,
          commentUuid: activeEdit.commentUuid,
          payload: { comment: commentInput },
        }).unwrap();

        addToast({
          variant: 'success',
          title: 'Comment Updated',
          description: 'Your comment has been edited successfully.',
        });
      } else {
        await createComment({
          listingUuid,
          payload: {
            comment: commentInput,
            parent: activeReply ? activeReply.parentCommentUuid : null,
          },
        }).unwrap();

        addToast({
          variant: 'success',
          title: activeReply ? 'Reply Added' : 'Comment Posted',
          description: activeReply
            ? `Your reply to ${activeReply.parentAuthorName} was posted.`
            : 'Your comment has been posted successfully.',
        });
      }

      setCommentInput('');
      setIsInputFocused(false);
      dispatch(clearCommentUiState());
    } catch (err) {
      console.error('Failed to submit comment:', err);
      addToast({
        variant: 'error',
        title: 'Action Failed',
        description: 'Unable to save your comment. Please try again.',
      });
    }
  };

  const handleStartEdit = (commentUuid: string, currentText: string) => {
    dispatch(setActiveEdit({ commentUuid, currentText }));
    setCommentInput(currentText);
    setIsInputFocused(true);
  };

  const handleStartReply = (parentCommentUuid: string, parentAuthorName: string) => {
    dispatch(setActiveReply({ parentCommentUuid, parentAuthorName }));
    setCommentInput('');
    setIsInputFocused(true);
  };

  const handleCancel = () => {
    dispatch(clearCommentUiState());
    setCommentInput('');
    setIsInputFocused(false);
  };

  // Open overlay confirmation modal
  const promptDelete = (commentUuid: string) => {
    setDeleteTargetUuid(commentUuid);
  };

  // Execute deletion upon modal confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTargetUuid) return;

    try {
      await deleteComment({ listingUuid, commentUuid: deleteTargetUuid }).unwrap();
      addToast({
        variant: 'success',
        title: 'Comment Deleted',
        description: 'The comment was permanently removed.',
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Could not delete the comment. Please try again.',
      });
    } finally {
      setDeleteTargetUuid(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatHandle = (name: string) => {
    if (!name) return '@user';
    return `@${name.toLowerCase().replace(/\s+/g, '')}`;
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 p-5 md:p-6 shadow-sm flex flex-col gap-5 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Comments
              <span className="text-xs md:text-sm font-semibold text-gray-500">
                {commentList.length}
              </span>
            </h3>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {(activeReply || activeEdit) && (
            <div className="flex items-center justify-between bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-medium text-emerald-800">
              <span>
                {activeReply && `Replying to ${activeReply.parentAuthorName}`}
                {activeEdit && 'Editing comment'}
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-emerald-600 hover:text-emerald-800 p-0.5 rounded-md hover:bg-emerald-100 transition"
              >
                <LuX className="text-sm" />
              </button>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              You
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                value={commentInput}
                onFocus={() => setIsInputFocused(true)}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={
                  activeReply
                    ? 'Add a reply...'
                    : activeEdit
                    ? 'Edit comment...'
                    : 'Add a comment...'
                }
                className="w-full pb-1.5 bg-transparent border-b border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />

              {(isInputFocused || commentInput.trim().length > 0) && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating || !commentInput.trim()}
                    className="px-4 py-1.5 bg-primary-green hover:bg-primary-green-hover text-white text-xs font-semibold rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <LuSend className="text-xs" />
                    <span>{activeEdit ? 'Save' : 'Comment'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Comments Thread */}
        {isLoading ? (
          <div className="py-8 text-center text-xs font-medium text-gray-400">Loading discussion...</div>
        ) : isError ? (
          <div className="py-8 text-center text-xs font-medium text-red-500">Failed to load comments.</div>
        ) : commentList.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-gray-400">
            No comments yet. Start the conversation!
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            {commentList.map((comment: ListingComment) => {
              const hasReplies = comment.replies && comment.replies.length > 0;
              const isExpanded = !!expandedReplies[comment.uuid];

              return (
                <div key={comment.uuid} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {getInitials(comment.user?.full_name)}
                  </div>

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {formatHandle(comment.user?.full_name)}
                      </span>
                      <span className="text-[11px] text-gray-400 shrink-0">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {comment.edited && (
                        <span className="text-[10px] text-gray-400 italic shrink-0">(edited)</span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-gray-800 leading-snug wrap-break-word">
                      {comment.comment}
                    </p>

                    <div className="flex items-center gap-3 text-gray-500 text-xs pt-0.5">
                      <button
                        onClick={() => handleStartReply(comment.uuid, comment.user?.full_name)}
                        className="hover:bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 font-medium transition cursor-pointer text-gray-600 hover:text-gray-900"
                      >
                        <LuReply className="text-xs" />
                        <span>Reply</span>
                      </button>
                      <button
                        onClick={() => handleStartEdit(comment.uuid, comment.comment)}
                        className="hover:bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 font-medium transition cursor-pointer text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => promptDelete(comment.uuid)}
                        className="hover:bg-red-50 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer ml-auto"
                      >
                        <LuTrash2 className="text-xs" />
                      </button>
                    </div>

                    {hasReplies && (
                      <div className="mt-1">
                        <button
                          onClick={() => toggleReplies(comment.uuid)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-full transition cursor-pointer"
                        >
                          {isExpanded ? (
                            <LuChevronUp className="text-sm" />
                          ) : (
                            <LuChevronDown className="text-sm" />
                          )}
                          <span>
                            {comment.replies.length}{' '}
                            {comment.replies.length === 1 ? 'reply' : 'replies'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="flex flex-col gap-3 mt-2 pl-2 border-l-2 border-gray-100">
                            {comment.replies.map((reply: CommentReply) => (
                              <div key={reply.uuid} className="flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {getInitials(reply.user?.full_name)}
                                </div>

                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-gray-800 truncate">
                                      {formatHandle(reply.user?.full_name)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 shrink-0">
                                      {new Date(reply.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-snug wrap-break-word">
                                    {reply.comment}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay Modal */}
      {deleteTargetUuid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl">
              <AlertTriangle />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-gray-900">Delete Comment?</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetUuid(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}