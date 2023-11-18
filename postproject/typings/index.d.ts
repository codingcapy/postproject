declare global {
  namespace Express {
    interface User {
      id: number;
      uname: string;
      password: string;
    }
  }
}

interface Comment {
  id: number;
  post_id: number;
  creator: number;
  description: any;
  timestamp: number;
}

export { User, Comment };
