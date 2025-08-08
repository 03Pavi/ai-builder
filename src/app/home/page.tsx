"use client";

import { useState } from "react";
import {
	TextField,
	Button,
	Paper,
	CardContent,
	Box,
	CircularProgress,
	useMediaQuery,
	IconButton,
} from "@mui/material";
import FileNode from "@/components/builder/file-node";
import CodeEditor from "@/components/builder/code-editor";
import useDownloadAsZip from "@/components/dashboard/prompt-input/download-zip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface FileNode {
	name: string;
	type: "file" | "folder";
	content?: string;
	children?: FileNode[];
}

export default function GenerateProjectForm() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState({
		enhancing: false,
		generating: false,
	});
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

	const handleEnhancePrompt = async () => {
		if (!message.trim()) return;
		setLoading((prev) => ({ ...prev, enhancing: true }));

		try {
			const res = await fetch("/api/enhance-prompt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ instructions: message }),
			});

			const data = await res.json();
			setMessage(data.result);
		} catch (error) {
			console.error("Enhance prompt error:", error);
		} finally {
			setLoading((prev) => ({ ...prev, enhancing: false }));
		}
	};

	const handleSubmit = async () => {
		if (!message.trim()) return;

		setLoading((prev) => ({ ...prev, generating: true }));
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
			console.error("Generate project error:", error);
		} finally {
			setLoading((prev) => ({ ...prev, generating: false }));
		}
	};

	const isMobile = useMediaQuery("(max-width:768px)");

	return (
		<>
			<Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 2 }}>
				<CardContent>
					<Box mb={2} display="flex" alignItems="flex-start">
						<TextField
							multiline
							fullWidth
							disabled={loading.generating}
							minRows={5}
							id="message"
							placeholder="Enter your instructions..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							variant="outlined"
						/>
						<Box ml={1} mt={0.5}>
							<IconButton
								onClick={handleEnhancePrompt}
								disabled={loading.enhancing || loading.generating}
							>
								{loading.enhancing ? (
									<CircularProgress size={24} />
								) : (
									<AutoAwesomeIcon />
								)}
							</IconButton>
						</Box>
					</Box>

					<Box display="flex" gap={2}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							disabled={loading.generating || loading.enhancing}
						>
							{loading.generating ? (
								<CircularProgress size={24} />
							) : (
								"Generate Project"
							)}
						</Button>
						{response && <useDownloadAsZip fileTree={response} />}
					</Box>
				</CardContent>
			</Paper>

			<Box
				display="flex"
				height="100vh"
				flexDirection={isMobile ? "column" : "row"}
			>
				<Box
					sx={{
						width: isMobile ? "100%" : "20%",
						minWidth: isMobile ? "100%" : "400px",
						borderRight: isMobile ? "none" : "1px solid #ccc",
						overflowY: "auto",
						p: 2,
					}}
				>
					<FileNode
						node={response}
						onSelectFile={handleFileSelect}
						isLoading={loading.generating || loading.enhancing}
					/>
				</Box>

				<Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
					<CodeEditor
						isLoading={loading.generating || loading.enhancing}
						value={selectedFileContent}
						fileName={selectedFileName}
						onChange={handleContentChange}
					/>
				</Box>
			</Box>
		</>
	);
}
