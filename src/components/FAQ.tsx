import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is AlgoMeter AI?</AccordionTrigger>
          <AccordionContent>
            AlgoMeter AI is a web application that uses artificial intelligence,
            specifically Google's Gemini 1.5 Flash model, to analyze and
            visualize the time and space complexity of algorithms. It helps
            developers understand and optimize their code's performance.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What can AlgoMeter AI do?</AccordionTrigger>
          <AccordionContent>
            AlgoMeter AI can analyze code snippets, provide insights on time and
            space complexity, offer optimization suggestions, and visualize
            algorithm performance through interactive charts. It leverages the
            power of Gemini 1.5 Flash for rapid and accurate analysis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is AlgoMeter AI free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, AlgoMeter AI is completely free to use as of now. There are no
            payments required to access any of its features.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            Does AlgoMeter AI store my code or data?
          </AccordionTrigger>
          <AccordionContent>
            No, AlgoMeter AI does not store any of your code or data. All
            analyses are performed in real-time and no information is retained
            after the session ends.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            How can I use AlgoMeter AI to learn algorithms and data structures?
          </AccordionTrigger>
          <AccordionContent>
            You can use AlgoMeter AI to experiment with different algorithms,
            compare their performance, and understand how changes in
            implementation affect efficiency. It's a great tool for visualizing
            concepts and reinforcing your understanding of algorithmic
            complexity.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Which programming languages does AlgoMeter AI support?
          </AccordionTrigger>
          <AccordionContent>
            AlgoMeter AI supports a wide range of popular programming languages,
            including Python, JavaScript, Java, C++, and more. The specific list
            of supported languages is continuously expanding.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            How accurate are AlgoMeter AI's complexity analyses?
          </AccordionTrigger>
          <AccordionContent>
            AlgoMeter AI uses Google's advanced Gemini 1.5 Flash model to
            provide highly accurate complexity analyses. However, for very
            complex or unusual algorithms, it's always a good idea to verify the
            results with manual analysis or benchmarking.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>
            Can AlgoMeter AI help with interview preparation?
          </AccordionTrigger>
          <AccordionContent>
            Yes! AlgoMeter AI is an excellent tool for interview preparation. It
            can help you understand the efficiency of your solutions to coding
            problems and guide you in optimizing your code, which is a crucial
            skill for technical interviews.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>
            Does AlgoMeter AI provide explanations for its analyses?
          </AccordionTrigger>
          <AccordionContent>
            Yes, AlgoMeter AI provides detailed explanations for its complexity
            analyses, including the reasoning behind the determined time and
            space complexities. This helps users understand and learn from the
            results.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>
            How often is AlgoMeter AI updated?
          </AccordionTrigger>
          <AccordionContent>
            AlgoMeter AI is continuously updated to improve its accuracy, add
            support for new programming languages, and introduce new features.
            We recommend checking our changelog or following our social media
            channels for the latest updates.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
