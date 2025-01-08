import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Card, Space } from "antd";
function App() {
	const [count, setCount] = useState(0);

	return (
		<Space direction="vertical" align="center" className="full-width-space">
			<Space align="center">
				center
				<Button type="primary">Primary</Button>
				<span className="mock-block">Block</span>
			</Space>
		</Space>
	);
}

export default App;
