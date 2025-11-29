// app/posts/[id]/page.tsx

interface PostDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  // Await the params Promise
  const { id } = await params;

  const res = await fetch(`https://dummyjson.com/posts/${id}`, {
    cache: "no-store",
  });

  const post = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}