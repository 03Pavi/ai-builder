"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

import styles from "./style.module.css";

const ResponsiveAppBar = () => {
	const isMobile = useMediaQuery("(max-width:600px)");
	return (
		<AppBar position="static" className={styles.appBar}>
			<Container maxWidth="xl">
				<Toolbar disableGutters className={styles.toolBar}>
					{!isMobile && (
						<Image src={"/nova.png"} alt="logo" width={70} height={50} />
					)}
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
						sx={{
							color: "inherit",
							textDecoration: "none",
							mt: 1,
						}}
					>
						Nova AI
					</Typography>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default ResponsiveAppBar;
