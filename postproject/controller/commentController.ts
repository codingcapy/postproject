import * as db from "../fake-db";

async function getComment(commentId: number) {
  return db.getComment(commentId);
}

export { getComment };
