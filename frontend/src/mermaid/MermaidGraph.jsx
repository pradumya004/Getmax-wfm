// frontend/src/mermaid/MermaidGraph.jsx

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidGraph({ chart, title = "Mermaid Diagram" }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setSvg("");
    mermaid.initialize({ startOnLoad: false });
    mermaid
      .render("mermaid-svg", chart)
      .then(({ svg }) => setSvg(svg))
      .catch(() => setError("Invalid Mermaid syntax"));
  }, [chart]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto min-w-[300px] max-w-full relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div
          className="mermaid flex justify-center items-center min-w-full"
          style={{ overflowX: "auto", width: "100%" }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}