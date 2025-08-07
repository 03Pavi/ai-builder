export const getFileColor = (filename: string): string => {
  const ext = filename.split(".").pop();

  switch (ext) {
    case "tsx":
    case "ts":
      return "#3178c6"; // TypeScript blue
    case "js":
      return "#f1e05a"; // JS yellow
    case "json":
      return "#cb5b16"; // JSON orange
    case "md":
      return "#6e7681"; // Markdown gray
    case "html":
      return "#e34c26"; // HTML orange-red
    case "css":
      return "#563d7c"; // CSS purple
    case "jsx":
      return "#61dafb"; // JSX React blue
    case "sh":
      return "#89e051"; // Shell green
    default:
      return "#ffffff"; // default white
  }
};