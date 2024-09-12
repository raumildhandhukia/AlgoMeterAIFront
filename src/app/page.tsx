import Main from "@/components/Main";

export default function Page() {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-10 px-4 lg:px-40">
        <div className="text-gray-300 text-xl lg:text-4xl space-y-2">
          <p>
            <span className="font-bold text-gradient">Estimate </span>
            the time and space complexity of your code using AI.
          </p>

          <p>
            <span className="font-bold text-gradient">Visualize</span> the
            iterations for different sizes of input in form of a chart.
          </p>
          <p>
            <span className="font-bold text-gradient">Measure</span> the
            performance of your code with AlgoMeter AI.
          </p>
        </div>
      </div>
      <Main />
    </>
  );
}
