import { Box } from "@mui/material";
import style from "./style.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return <Box className={style.layout}>{children}</Box>;
};

export default Layout;
