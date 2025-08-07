"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button"; // optional: if you're using a UI lib
import { IoMdDownload } from "react-icons/io";

type FileNode = {
	name: string;
	type: "file" | "folder";
	content?: string;
	children?: FileNode[];
};

interface Props {
	fileTree: FileNode | null;
}

export default function DownloadAsZip({ fileTree }: Props) {
	const handleDownload = () => {
		if (!fileTree) return;

		const zip = new JSZip();
		const root = zip.folder(fileTree.name);

		if (fileTree.children) {
			fileTree.children.forEach((child) => {
				addToZip(child, root!);
			});
		}

		zip.generateAsync({ type: "blob" }).then((blob) => {
			saveAs(blob, `${fileTree.name}.zip`);
		});
	};

	return (
		<Button onClick={handleDownload} disabled={!fileTree}>
			<IoMdDownload />
		</Button>
	);
}

function addToZip(node: FileNode, zip: JSZip, path = "") {
	const currentPath = path ? `${path}/${node.name}` : node.name;

	if (node.type === "file") {
		zip.file(currentPath, node.content || "");
	} else if (node.type === "folder" && node.children) {
		const folder = zip.folder(currentPath);
		node.children.forEach((child) => addToZip(child, zip, currentPath));
	}
}
