import { User } from "./typings";

// // @ts-nocheck
const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
  103: {
    id: 103,
    title: "BBQ Chicken has just opened its new Metrotown location",
    link: "https://bbqchickenca.com/",
    description:
      "BBQ Chicken has opened up a new location at #104-4418 Beresford Street at Metrotown. BBQ Chicken is known for serving up its signature chicken in over a dozen different flavours, including its Secret Sauced Chicken, Cheesling Chicken, and Gangnam Style Chicken, in addition to other Korean-influenced menu items, including Cheese Bul-Dak.",
    creator: 3,
    subgroup: "food",
    timestamp: 1690840361000,
  },
  104: {
    id: 104,
    title: "RIP List: 56 notable Vancouver restaurant closures we saw in 2022",
    link: "https://dailyhive.com/vancouver/vancouver-restaurant-closures-2022",
    description:
      "Some of these spots were revived with a new concept, while others sadly closed permanently.",
    creator: 2,
    subgroup: "food",
    timestamp: 1671642000000,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};

const votes = [
  { user_id: 2, post_id: 101, value: +1, vote_id: 1 },
  { user_id: 3, post_id: 101, value: +1, vote_id: 2 },
  { user_id: 4, post_id: 101, value: +1, vote_id: 3 },
  { user_id: 3, post_id: 102, value: -1, vote_id: 4 },
  { user_id: 3, post_id: 103, value: +1, vote_id: 5 },
  { user_id: 4, post_id: 103, value: +1, vote_id: 6 },
  { user_id: 1, post_id: 104, value: -1, vote_id: 7 },
  { user_id: 2, post_id: 104, value: -1, vote_id: 8 },
  { user_id: 3, post_id: 104, value: -1, vote_id: 9 },
  { user_id: 4, post_id: 104, value: -1, vote_id: 10 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id: number): Express.User  {
  return users[id as keyof typeof users];
}

function getUserByUsername(uname: string): Express.User | null {
  const user = Object.values(users).find((user) => user.uname === uname);
  if (user) return getUser(user.id);
  else return null;
}

// added by PK on 2023 11 19 9:17AM
function addUser(
  uname: string,
  password: string,
): User {
  let id = Math.max(...Object.keys(users).map(Number)) + 1;
  let user = {
    id,
    uname,
    password,
    timestamp: Date.now(),
  };
  users[id as keyof typeof users] = user;
  return user;
}

function getVotesForPost(post_id: number): Vote[] {
  return votes.filter((vote) => vote.post_id === post_id);
}

function addVote(user_id: number, post_id: number, value: any) {
  const vote_id = votes.length === 0 ? 1 : votes[votes.length - 1].vote_id + 1
  votes.push({ user_id, post_id, value, vote_id })
}

function decoratePost(post: Post): DecoratedPost {
  const decoratedPost = {
    ...post,
    creator: users[post.creator as keyof typeof users],
    votes: getVotesForPost(post.id),
    score: getVotesForPost(post.id).reduce((accumulated, curr) => accumulated + curr.value, 0),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({
        ...comment,
        creator: users[comment.creator as keyof typeof users],
      })),
  };
  return decoratedPost;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub: string) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub);
  }
  const allPostsDisplay = allPosts.map((post) => decoratePost(post));
  allPostsDisplay.sort((a, b) => b.timestamp - a.timestamp);
  return allPostsDisplay.slice(0, n);
}

function getPost(id: number): DecoratedPost | null {
  if (id in posts) return decoratePost(posts[id as keyof typeof posts]);
  else return null;
}

function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
): Post {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator,
    subgroup,
    timestamp: Date.now(),
  };
  posts[id as keyof typeof posts] = post;
  return post;
}

function editPost(
  post_id: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
    subgroup?: string;
  }
) {
  let post = posts[post_id as keyof typeof posts];
  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

function deletePost(post_id: number) {
  delete posts[post_id as keyof typeof posts];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

function addComment(post_id: number, creator: number, description: string) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: post_id,
    creator: creator,
    description,
    timestamp: Date.now(),
  };
  comments[id as keyof typeof comments] = comment;
  return comment;
}

function getCommentsByPostId(postId: number): Comment[] {
  let allComments = Object.values(comments);
  allComments = allComments.filter((comment) => comment.post_id == postId);
  const allCommentsDisplay = allComments.map((comment) => ({
    ...comment,
    username: getUser(comment.creator).uname,
  }));
  allCommentsDisplay.sort((a, b) => b.timestamp - a.timestamp);
  return allCommentsDisplay;
}

function getComment(commentId: number): Comment | null {
  if (commentId in comments) {
    const comment = comments[commentId as keyof typeof comments];
    const decoratedComment = {
      ...comment,
      username: getUser(comment.creator).uname,
    };
    return decoratedComment;
  } else return null;
}

function editComment(
  comment_id: number,
  changes: {
    description?: string;
  }
) {
  let comment = comments[comment_id as keyof typeof comments];

  if (changes.description) {
    comment.description = changes.description;
  }
}

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  addVote,
  decoratePost,
  getCommentsByPostId,
  getComment,
  addUser,
  editComment
};
