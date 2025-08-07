import React, { useState } from "react";
import { FaAngleRight, FaChevronDown } from "react-icons/fa";
import { FileIcon, defaultStyles } from "react-file-icon";

type FileNode = {
	name: string;
	type: "file" | "folder";
	content?: string;
	children?: FileNode[];
};

interface Props {
	node: FileNode | null;
	onSelectFile: (content: string, name: string) => void;
	isLoading?: boolean;
}

export default function FileNode({ node, onSelectFile, isLoading }: Props) {
	const [expanded, setExpanded] = useState<boolean>(true);
 
  if(isLoading) return <div>Loading...</div>;
	if (!node) return <div>No file selected</div>;
	const handleClick = () => {
		if (node.type === "file" && node.content) {
			onSelectFile(node.content, node.name);
		} else {
			setExpanded((prev) => !prev);
		}
	};

	const getExtension = (name: string) => name.split(".").pop() ?? "";

	const ext = getExtension(node.name);
	const iconStyle = defaultStyles[ext as keyof typeof defaultStyles] ?? {};

	return (
		<div style={{ paddingLeft: "1rem", backgroundColor: "#000" }}>
			<div
				onClick={handleClick}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.5rem",
					cursor: "pointer",
					fontWeight: node.type === "folder" ? "bold" : "normal",
					color: "#fff",
					fontSize: "14px",
					padding: "8px 0",
				}}
			>
				{node.type === "folder" ? (
					expanded ? (
						<FaChevronDown size={12} />
					) : (
						<FaAngleRight size={12} />
					)
				) : null}

				{node.type === "file" ? (
					<div style={{ width: 18, height: 18 }}>
						<FileIcon extension={ext} {...iconStyle} />
					</div>
				) : null}

				<span>{node.name}</span>
			</div>

			{expanded &&
				node.children?.map((child, index) => (
					<FileNode key={index} node={child} onSelectFile={onSelectFile} />
				))}
		</div>
	);
}
