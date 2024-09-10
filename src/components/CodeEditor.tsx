import React from "react";
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
  return (
    <div className="code-editor-container">
      <CodeMirror
        value={initialValue}
        height="60vh"
        width="90vw"
        theme={vscodeDark}
        extensions={[javascript({ jsx: true })]}
        placeholder="Write your code here..."
        onChange={(value: string) => onChange && onChange(value)}
      />
    </div>
  );
};

export default CodeEditor;
