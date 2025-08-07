"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import FileNode from "@/components/builder/file-node";
import CodeEditor from "@/components/builder/code-editor";
import DownloadAsZip from "@/components/builder/download-zip";

interface FileNode {
	name: string;
	type: "file" | "folder";
	content?: string;
	children?: FileNode[];
}

export default function GenerateProjectForm() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<FileNode | null>(null);
	const [selectedFileContent, setSelectedFileContent] = useState("");
	const [selectedFileName, setSelectedFileName] = useState("");

	const handleFileSelect = (content: string, name: string) => {
		setSelectedFileContent(content);
		setSelectedFileName(name);
	};

	const handleContentChange = (newContent: string) => {
		setSelectedFileContent(newContent);
	};

	const handleSubmit = async () => {
		if (!message.trim()) return;

		setLoading(true);
		setResponse(null);

		try {
			const res = await fetch("/api/generate-project", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ instructions: message }),
			});

			const data = await res.json();

			let parsedResult: FileNode;

			if (typeof data.result === "string") {
				let cleaned = data.result
					.replace(/^\s*```(?:json)?/, "")
					.replace(/```$/, "")
					.trim();

				try {
					parsedResult = eval(`(${cleaned})`);
				} catch (e) {
					console.warn("eval failed, trying JSON.parse...");
					cleaned = cleaned.replace(/`/g, '"');
					parsedResult = JSON.parse(cleaned);
				}
			} else {
				parsedResult = data.result;
			}

			setResponse(parsedResult);
		} catch (error) {
			console.error("Generation error:", error);
		} finally {
			setLoading(false);
		}
	};
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
	return (
		<>
			<Card className="max-w-xl mx-auto mt-10">
				<CardContent className="space-y-4 pt-6">
					<div className="space-y-2">
						<Textarea
							id="message"
							placeholder="Enter your instructions..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="min-h-[120px]"
						/>
					</div>

					<div className="flex gap-2">
						<Button onClick={handleSubmit} disabled={loading}>
							{loading ? "Generating..." : "Generate Project"}
						</Button>
						{response && <DownloadAsZip fileTree={response} />}
					</div>
				</CardContent>
			</Card>

			<div style={{ display: "flex", height: "100vh",}}>
				<div
					style={{
						width: "20%",
						borderRight: "1px solid #ccc",
						overflowY: "auto",
						padding: "1rem",
            minWidth: isMobile ? "100%" : "400px"
					}}
				>
					<FileNode node={response} onSelectFile={handleFileSelect} isLoading={loading}/>
				</div>

				<div style={{ width: "80%", overflowY: "auto", padding: "1rem"}}>
					<CodeEditor
            isLoading={loading}
						value={selectedFileContent}
						fileName={selectedFileName}
						onChange={handleContentChange}
					/>
				</div>
			</div>
		</>
	);
}
