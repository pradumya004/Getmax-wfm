import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidGraph({ chart }) {
  const chartRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    if (chartRef.current) {
      chartRef.current.removeAttribute("data-processed");
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto min-w-[300px] max-w-full">
      <pre className="mermaid" ref={chartRef}>
        {chart}
      </pre>
    </div>
  );
}
