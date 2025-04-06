import CompanySearch from "@/components/CompanySearch";

export default function Page() {
  return (
    <div className="w-full max-w-7xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold mb-4">
          <span className="text-gradient">Company-wise</span> LeetCode Questions
        </h1>
        <p className="text-gray-300 text-lg lg:text-xl">
          Search for interview questions asked by top tech companies
        </p>
      </div>
      <CompanySearch />
    </div>
  );
}
