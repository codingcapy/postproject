import * as db from "../fake-db";

async function getComment(commentId: number) {
  return db.getComment(commentId);
}

async function editComment(
  commentId: number,
  changes: {
    description?: string;
  }
) {
  return db.editComment(commentId, changes);
}

async function deleteComment(id: number) {
  return db.deleteComment(id)
}

async function getReplies(commentId: number) {
  return db.getReplies(commentId);
}

async function addReply(commentId: number, userId: number, comment: string) {
  return db.addReply(commentId, userId, comment);
}

async function getReply(replyId: number) {
  return db.getReply(replyId);
}

async function deleteReply(replyId: number) {
  return db.deleteReply(replyId);
}

async function editReply(
  replyId: number,
  changes: {
    description?: string;
  }
) {
  return db.editReply(replyId, changes);
}

export { getComment, editComment, deleteComment, getReplies, addReply, getReply, deleteReply, editReply, };
