import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
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
  if (userId != db.getPost(postId).creator.id) return false;
  else {
    db.editPost(postId, changes);
    return true;
  }
}

// added by PK on 2023 11 10 3:07PM
async function createPost(title:any, link:any,  creator:any, description:any, subgroup:any,){
  return db.addPost(title, link, creator, description, subgroup)
}

// added by PK on 2023 11 10 3:07PM
async function getPost(id:any){
  return db.getPost(id)
}

export { getPosts, createPost, getPost, editPost };
