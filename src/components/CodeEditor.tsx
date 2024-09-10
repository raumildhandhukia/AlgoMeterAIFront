import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useState, useEffect } from "react";
interface CodeEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getHeight = () => {
    if (isMobile) {
      return "60vh";
    }
    return "60vh";
  };

  const getWidth = () => {
    if (isMobile) {
      return "90vw";
    }
    return "90vw";
  };

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
