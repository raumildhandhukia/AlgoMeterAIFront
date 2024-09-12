import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getHeight = () => {
    return isMobile ? "60vh" : "60vh";
  };

  const getWidth = () => {
    return isMobile ? "90vw" : "90vw";
  };

  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <div className="code-editor-container">
      <CodeMirror
        value={initialValue}
        height={getHeight()}
        width={getWidth()}
        theme={vscodeDark}
        extensions={[javascript({ jsx: true })]}
        placeholder="paste your code here..."
        onChange={(value: string) => onChange && onChange(value)}
      />
    </div>
  );
};

export default CodeEditor;
