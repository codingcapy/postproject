import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
  return db.getPosts(n, sub);
}

async function getPost(id: number) {
  return db.getPost(id);
}

async function editPost(
  postId: number,
  userId: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
    subgroup?: string;
  }
) {
  if (userId != db.getPost(postId).creator.id) return false;
  else {
    db.editPost(postId, changes);
    return true;
  }
}

export { getPosts, getPost, editPost };
