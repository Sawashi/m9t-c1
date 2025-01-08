import { useEffect, useState } from "react";
import "./App.css";
import {
	Alert,
	Button,
	Card,
	Col,
	Flex,
	Input,
	message,
	Row,
	Select,
	Space,
	Spin,
	Table,
} from "antd";

import Icon from "./components/Icon";

import { SwapOutlined } from "@ant-design/icons";

interface CurrencyData {
	currency: string;
	date: string;
	price: number;
}

function App() {
	const onSearch = (value: string) => {
		console.log("search:", value);
	};
	const [messageApi, contextHolder] = message.useMessage();
	const [data, setData] = useState<CurrencyData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [fromCurrency, setFromCurrency] = useState<string | undefined>(
		undefined
	);
	const [fromAmmount, setFromAmmount] = useState<number>(0);
	const [toAmmount, setToAmmount] = useState<number>(0);
	const [result, setResult] = useState<number>(0);

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
				const result: CurrencyData[] = await response.json();

				// Group by currency and get the latest data for each currency
				const latestData = Object.values(
					result.reduce((acc: { [key: string]: CurrencyData }, item) => {
						if (
							!acc[item.currency] ||
							new Date(item.date) > new Date(acc[item.currency].date)
						) {
							acc[item.currency] = item;
						}
						return acc;
					}, {})
				);

				setData(latestData);
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
	useEffect(() => {
		setResult(0);
	}, [fromCurrency, toCurrency, fromAmmount]);

	const columns = [
		{
			title: "Currency",
			dataIndex: "currency",
			key: "currency",
			render: (currency: string) => (
				<>
					<Icon name={currency} />
					{currency}
				</>
			),
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
	const quickColumns = [
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
		},
		{
			title: "Converted",
			dataIndex: "converted",
			key: "converted",
		},
	];

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" />;
	const convertCurrency = (
		fromCurrency: string,
		toCurrency: string,
		ammount: number
	) => {
		if (ammount <= 0 || isNaN(ammount)) {
			messageApi.error("Please enter a valid amount");
			return;
		}
		if (fromCurrency == "" || toCurrency == "") {
			messageApi.error("Please select currency");
			return;
		}
		// Get the rate of the currency
		const fromRate = data.find((item) => item.currency === fromCurrency)?.price;
		const toRate = data.find((item) => item.currency === toCurrency)?.price;
		if (!fromRate || !toRate) return 0;
		// Convert the currency, only take 5 decimal places
		const convertedAmmount = (ammount / fromRate) * toRate;
		setResult(Number(convertedAmmount.toFixed(5)));
	};

	// Get unique currencies
	const currencies = [...new Set(data.map((item) => item.currency))];

	const quickConversionData = [1, 3, 5, 15, 30].map((amount) => {
		const fromRate = data.find((item) => item.currency === fromCurrency)?.price;
		const toRate = data.find((item) => item.currency === toCurrency)?.price;
		const convertedAmount =
			fromRate && toRate ? (amount / fromRate) * toRate : 0;
		return {
			key: amount.toString(),
			amount,
			converted: convertedAmount.toFixed(5),
		};
	});

	return (
		<Space direction="vertical" align="center" className="full-width-space">
			{contextHolder}
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
								onChange={(e) => {
									setFromAmmount(Number(e.target.value));
								}}
								prefix={<span className="name-currency">{fromCurrency}</span>}
							/>
						</div>
					</Col>
					<Col>
						<Row gutter={16} style={{ position: "relative" }}>
							<Col>
								<div className="input-box">
									<div className="label-small">From</div>
									<Select
										className="input-change"
										showSearch
										placeholder="Select currency"
										optionFilterProp="label"
										prefix={<Icon name={fromCurrency || ""} />}
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
							<Button
								className="swap-button"
								onClick={() => {
									// Swap logic
									const tempCurrency = fromCurrency;
									setFromCurrency(toCurrency);
									setToCurrency(tempCurrency);
								}}
							>
								<SwapOutlined />
							</Button>
							<Col>
								<div className="input-box">
									<div className="label-small">To</div>
									<Select
										className="input-change"
										showSearch
										placeholder="Select currency"
										optionFilterProp="label"
										onSearch={onSearch}
										prefix={<Icon name={toCurrency || ""} />}
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
						<Button
							type="primary"
							className="btn-convert"
							onClick={() =>
								convertCurrency(
									fromCurrency || "",
									toCurrency || "",
									fromAmmount
								)
							}
						>
							Convert
						</Button>
					</Flex>
				</Row>
				{result > 0 && (
					<Space direction="vertical" align="start" className="result-box-full">
						<div className="average-section">Result</div>
						<Space direction="horizontal" align="center" className="result-box">
							<span className="result-text">{fromAmmount}</span>
							{fromCurrency}
							<Icon name={fromCurrency || ""} />=
							<span className="result-text">{result}</span>
							{toCurrency}
							<Icon name={toCurrency || ""} />
						</Space>
						{/* add a quick exchange table at here */}

						<Table
							columns={quickColumns}
							dataSource={quickConversionData}
							rowKey="key"
							pagination={false}
							size="small"
							className="table-quick-exchange"
							bordered
						/>
					</Space>
				)}

				<div className="section-header">Rate</div>
				<Table
					bordered
					dataSource={data}
					columns={columns}
					rowKey={(record) => `${record.currency}-${record.date}`}
					pagination={{
						position: ["bottomCenter"],
					}}
				/>
			</Card>
		</Space>
	);
}

export default App;
