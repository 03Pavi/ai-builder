"use client";
import { useState } from "react";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	Typography,
	useMediaQuery,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PromptInput from "../prompt-input";
import { suggestionsList } from "../prompt-input/suggestion-list";
import { useDownloadAsZip } from "../prompt-input/download-zip";
import { useLongPress } from "use-long-press";
import styles from "./style.module.css";

const HeroSection = () => {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState({
		enhancing: false,
		generating: false,
	});
	const [response, setResponse] = useState<FileNode | null>(null);
	const handleDownload = useDownloadAsZip(response);
	const handlers = useLongPress(() => {
		setResponse(null);
	});
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
		<Box className={styles.heroSection}>
			<Box className={styles.heroSectionText}>
				<Typography
					component="p"
					variant="h2"
					fontWeight={800}
					className={styles.heroSectionHeading}
				>
					Create Web Apps With
				</Typography>
				<Typography
					component="p"
					variant="h2"
					fontWeight={800}
					className={styles.heroSectionSubHeading}
				>
					Artificial Intelligence
				</Typography>
			</Box>
			<Box className={styles.formControl}>
				<PromptInput
					handleEnhancePrompt={handleEnhancePrompt}
					isLoading={loading}
					message={message}
					setMessage={setMessage}
				/>
				<Box className={styles.formButton}>
					{loading.generating ? (
						<Button variant="contained" className={styles.disabledButton}>
							Generating...
						</Button>
					) : !response ? (
						<Button
							variant="contained"
							className={
								!message.trim() ? styles.disabledButton : styles.generateButton
							}
							onClick={handleSubmit}
						>
							Generate
						</Button>
					) : (
						<Button
							variant="contained"
							className={styles.generateButton}
							onClick={handleDownload}
							{...handlers()}
						>
							Download project
						</Button>
					)}
					{!isMobile && (
						<IconButton
							className={styles.enhanceButton}
							onClick={handleEnhancePrompt}
							disabled={loading.enhancing || loading.generating}
						>
							{loading.enhancing ? (
								<CircularProgress size={18} color="inherit" />
							) : (
								<AutoAwesomeIcon color="inherit" />
							)}
						</IconButton>
					)}
				</Box>
				{response && (
					<Typography component="p" className={styles.suggestionText}>
						<strong>Tip:</strong>: Hold to reset
					</Typography>
				)}
			</Box>
			<Box className={styles.quickTry}>
				<Typography component="p" className={styles.quickTryHeading}>
					Quick Try
				</Typography>
				<Box className={styles.quickTryList}>
					{suggestionsList.map((suggestion, index) => (
						<Chip
							className={styles.quickTryText}
							key={index}
							label={suggestion.title}
							onClick={() => setMessage(suggestion.description)}
						/>
					))}
				</Box>
			</Box>
			{/* <IconButton className={styles.downloadButton}>
				{true ? (
					<DownloadIcon color="inherit" />
				) : (
					<FileDownloadDoneIcon color="inherit" />
				)}
			</IconButton> */}
		</Box>
	);
};

export default HeroSection;
