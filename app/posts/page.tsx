// app/posts/page.jsx
import PostCard from "../components/Postcard";

export default async function PostsPage() {
  const res = await fetch("https://dummyjson.com/posts", {
    cache: "no-store",
  });

  const data = await res.json();
  const posts = data.posts;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Posts</h1>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}