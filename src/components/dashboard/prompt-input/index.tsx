"use client";
import {
	CircularProgress,
	IconButton,
	InputBase,
	useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { suggestionsList } from "./suggestion-list";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import styles from "./style.module.css";
interface PromptInputProps {
	isLoading: {
		enhancing: boolean;
		generating: boolean;
	};
	message: string;
	setMessage: (message: string) => void;
	handleEnhancePrompt: () => void;
}

const PromptInput = ({
	isLoading,
	message,
	setMessage,
	handleEnhancePrompt,
}: PromptInputProps) => {
	const [placeholderIndex, setPlaceholderIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setPlaceholderIndex((prevIndex) =>
				prevIndex === suggestionsList.length - 1 ? 0 : prevIndex + 1
			);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const isMobile = useMediaQuery("(max-width: 600px)");
	return (
		<InputBase
			readOnly={isLoading.generating}
			id="message"
			placeholder={suggestionsList[placeholderIndex].description}
			value={message}
			multiline={!isMobile ? false : true}
			maxRows={2}
			className={styles.formInput}
			onChange={(e) => setMessage(e.target.value)}
			endAdornment={
				message ? (
					<>
						{isMobile && (
							<>
								{!isLoading.enhancing ? (
									<IconButton
										className={styles.enhanceButton}
										color="inherit"
										onClick={handleEnhancePrompt}
									>
										<AutoAwesomeIcon color="inherit" />
									</IconButton>
								) : (
									<CircularProgress size={20} color="inherit" />
								)}
							</>
						)}
						<IconButton
							className={styles.clearButton}
							onClick={() => setMessage("")}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					</>
				) : undefined
			}
		/>
	);
};

export default PromptInput;
