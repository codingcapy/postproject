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

export { getComment, editComment, deleteComment };
