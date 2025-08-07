import React from "react";
import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  fileName: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export default function CodeEditor({ value, fileName, onChange,isLoading }: Props) {
  const getLanguage = (fileName: string): string => {
    if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) return "typescript";
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "javascript";
    if (fileName.endsWith(".json")) return "json";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".css")) return "css";
    return "plaintext";
  };

  if(isLoading) return null
  return (
    <Editor
      height="100vh"
      theme="vs-dark"
      language={getLanguage(fileName)}
      value={value}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
}
