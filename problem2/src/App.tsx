import { useEffect, useState } from "react";
import "./App.css";
import {
	Alert,
	Button,
	Card,
	Col,
	Flex,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Typography,
} from "antd";

interface CurrencyData {
	currency: string;
	date: string;
	price: number;
}

function App() {
	const onSearch = (value: string) => {
		console.log("search:", value);
	};
	const [data, setData] = useState<CurrencyData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [fromCurrency, setFromCurrency] = useState<string | undefined>(
		undefined
	);
	const [toCurrency, setToCurrency] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://interview.switcheo.com/prices.json"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const columns = [
		{
			title: "Currency",
			dataIndex: "currency",
			key: "currency",
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (text: string) => new Date(text).toLocaleString(),
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (price: number) => `$${price.toFixed(2)}`,
		},
	];

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" />;

	// Get unique currencies
	const currencies = [...new Set(data.map((item) => item.currency))];

	return (
		<Space direction="vertical" align="center" className="full-width-space">
			<div className="curve-div"></div>
			<div className="header-big">Currency Converter</div>
			<Card bordered={false} className="card-shadow">
				<div className="section-header">Converter</div>
				<Row gutter={[16, 16]}>
					<Col>
						<div className="input-box">
							<div className="label-small">Ammount</div>
							<Input
								className="input-change"
								size="large"
								placeholder="Enter amount"
								prefix={<span>RM</span>}
							/>
						</div>
					</Col>
					<Col>
						<Row gutter={16}>
							<Col>
								<div className="input-box">
									<div className="label-small">From</div>
									<Select
										className="input-change"
										showSearch
										placeholder="Select currency"
										optionFilterProp="label"
										onSearch={onSearch}
										value={fromCurrency}
										onChange={setFromCurrency}
										options={currencies.map((currency) => ({
											value: currency,
											label: currency,
										}))}
									/>
								</div>
							</Col>
							<Col>
								<div className="input-box">
									<div className="label-small">To</div>
									<Select
										className="input-change"
										showSearch
										placeholder="Select currency"
										optionFilterProp="label"
										onSearch={onSearch}
										value={toCurrency}
										onChange={setToCurrency}
										options={currencies.map((currency) => ({
											value: currency,
											label: currency,
										}))}
									/>
								</div>
							</Col>
						</Row>
					</Col>

					<Flex justify="flex-end" align="center">
						<Button type="primary">Convert</Button>
					</Flex>
				</Row>

				<div className="section-header">Rate</div>
				<Table
					dataSource={data}
					columns={columns}
					rowKey={(record) => `${record.currency}-${record.date}`}
				/>
			</Card>
		</Space>
	);
}

export default App;
