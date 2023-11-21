import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = "") {
  return db.getPosts(n, sub);
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
  if (userId != db.getPost(postId)!.creator.id) return false;
  else {
    db.editPost(postId, changes);
    return true;
  }
}

// added by PK on 2023 11 10 3:07PM
async function createPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  return db.addPost(title, link, creator, description, subgroup);
}

// added by PK on 2023 11 10 3:07PM
async function getPost(id: number) {
  return db.getPost(id);
}
async function deletePost(id: number) {
  return db.deletePost(id);
}

async function getSubs() {
  return db.getSubs();
}

async function getCommentsByPostId(postId: number) {
  return db.getCommentsByPostId(postId);
}

async function addComment(postId: number, userId: number, comment: string) {
  return db.addComment(postId, userId, comment);
}

async function addVote(user_id: number, post_id: number, value: any){
  return db.addVote(user_id, post_id, value)
}

export {
  getPosts,
  createPost,
  getPost,
  editPost,
  deletePost,
  getSubs,
  getCommentsByPostId,
  addComment,
  addVote
};
