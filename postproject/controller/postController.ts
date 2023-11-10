import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
  return db.getPosts(n, sub);
}

// added by PK on 2023 11 10 3:07PM
async function createPost(title:any, link:any, description:any, subgroup:any, creator:any,){
  return db.addPost(title, link, creator, description, subgroup)
}

export { getPosts, createPost };
