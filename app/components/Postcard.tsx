// components/PostCard.jsx
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          {post.title}
        </h2>

        <p style={{ color: "#555", marginBottom: "0.75rem" }}>
          {post.body.slice(0, 100)}...
        </p>

        <div style={{ marginBottom: "0.75rem" }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-block",
                marginRight: "6px",
                marginBottom: "6px",
                padding: "4px 8px",
                background: "#f2f2f2",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "#333",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div style={{ fontSize: "0.85rem", color: "#666" }}>
          👍 {post.reactions.likes} | 👎 {post.reactions.dislikes} | 👁 {post.views}
        </div>
      </div>
    </Link>
  );
}
