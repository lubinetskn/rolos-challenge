export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  reactions: number;
}

export interface PostsResponse {
  posts: Post[];
  limit: number;
  skip: number;
  total: number;
}

const API_URL = 'https://dummyjson.com/posts';

export async function getAllPosts(): Promise<PostsResponse> {
  const response = await fetch(API_URL);

  return response.json();
}

export async function getPosts(limit: number, skip: number): Promise<PostsResponse> {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching posts: ${error}`);
    throw error;
  }
}

export async function getPost(postId: Post['id']): Promise<Post> {
  const response = await fetch(`${API_URL}/${postId}`);

  return response.json();
}
