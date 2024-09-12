import Link from "next/link";

const blogPosts = [
  {
    title: "Terminology Used When Analyzing Time Complexity",
    date: "2024-01-23",
    slug: "terminology-time-complexity",
  },
  {
    title: "Worst Time Complexity Explained",
    date: "2024-01-21",
    slug: "worst-time-complexity",
  },
  {
    title: "Java Time Complexity: A Comprehensive Guide",
    date: "2024-01-19",
    slug: "java-time-complexity",
  },
  {
    title: "Python Time Complexity: From Basics to Advanced",
    date: "2024-01-19",
    slug: "python-time-complexity",
  },
  {
    title: "C++ Time Complexity: Understanding Performance",
    date: "2024-01-18",
    slug: "cpp-time-complexity",
  },
  {
    title: "Binary Search Time Complexity Analysis",
    date: "2024-01-12",
    slug: "binary-search-time-complexity",
  },
  {
    title: "Mastering O(n log n) Time Algorithms",
    date: "2023-08-06",
    slug: "mastering-nlogn-algorithms",
  },
  {
    title: "Linear Time Algorithms Unveiled: O(n) Complexity",
    date: "2023-08-05",
    slug: "linear-time-algorithms",
  },
  {
    title: "The Power of Logarithmic Algorithms: O(log n)",
    date: "2023-08-04",
    slug: "logarithmic-algorithms",
  },
  {
    title: "The Beauty of Constant Time Algorithms: O(1)",
    date: "2023-08-03",
    slug: "constant-time-algorithms",
  },
  {
    title: "Understanding Time Complexity: A Beginner's Guide",
    date: "2023-07-25",
    slug: "time-complexity-beginners-guide",
  },
  {
    title: "Common Time Complexity Classes Explained",
    date: "2023-07-25",
    slug: "time-complexity-classes",
  },
  {
    title: "A Comprehensive Guide to Code Runtime Complexity Analysis",
    date: "2023-07-25",
    slug: "runtime-complexity-analysis",
  },
  {
    title: "How to Analyze the Time Complexity of Your Code",
    date: "2023-07-25",
    slug: "analyzing-code-time-complexity",
  },
  {
    title: "The Importance of Time Complexity in Algorithm Design",
    date: "2023-07-25",
    slug: "time-complexity-importance",
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {blogPosts.map((post, index) => (
          <li key={index}>
            <Link
              href={`/blog/${post.slug}`}
              className="block hover:bg-gray-700 p-4 rounded"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-400">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
