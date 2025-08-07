function generateFolderStructure(input: {
  projectType: string;
  stack: string[];
  features: string[];
}): {
  name: string;
  type: 'folder';
  children: any[];
} {
  const { stack, features } = input;

  const files: any[] = [];

  // Basic structure
  const appFolder = {
    name: "app",
    type: "folder",
    children: [
      {
        name: "page.tsx",
        type: "file",
        content: `export default function Home() {
  return <h1>Welcome to your ${input.projectType}!</h1>;
}`
      }
    ]
  };

  const configFiles = [
    {
      name: "tailwind.config.ts",
      type: "file",
      content: stack.includes("tailwind")
        ? `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};`
        : "",
    },
    {
      name: "tsconfig.json",
      type: "file",
      content: stack.includes("typescript")
        ? `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "preserve"
  }
}`
        : "",
    },
  ];

  const featureFolders = features.map((feature) => ({
    name: `features/${feature}`,
    type: "folder",
    children: [
      {
        name: "index.ts",
        type: "file",
        content: `// ${feature} feature logic`,
      },
    ],
  }));

  return {
    name: "my-app",
    type: "folder",
    children: [
      appFolder,
      {
        name: "features",
        type: "folder",
        children: featureFolders.flat(),
      },
      ...configFiles,
    ],
  };
}
