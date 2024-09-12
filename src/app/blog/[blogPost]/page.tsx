import BlogPost from "@/components/BlogPost";

export default function BlogPostPage({
  params,
}: {
  params: { blogPost: string };
}) {
  return <BlogPost slug={params.blogPost} />;
}
