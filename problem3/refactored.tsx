interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: string;
}
interface FormattedWalletBalance {
	currency: string;
	amount: number;
	formatted: string;
}
const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
	const { children, ...rest } = props;
	const balances = useWalletBalances();
	const prices = usePrices();

	const getPriority = (blockchain: string): number => {
		switch (blockchain) {
			case "Osmosis":
				return 100;
			case "Ethereum":
				return 50;
			case "Arbitrum":
				return 30;
			case "Zilliqa":
				return 20;
			case "Neo":
				return 20;
			default:
				return -99;
		}
	};

	const sortedBalances = useMemo(() => {
		return balances
			.filter((balance: WalletBalance) => {
				const balancePriority = getPriority(balance.blockchain);
				if (balancePriority > -99) {
					if (balance.amount >= 0) {
						return true;
					}
				}
				return false;
			})
			.sort((lhs: WalletBalance, rhs: WalletBalance) => {
				const leftPriority = getPriority(lhs.blockchain);
				const rightPriority = getPriority(rhs.blockchain);
				if (leftPriority > rightPriority) {
					return -1;
				} else if (rightPriority > leftPriority) {
					return 1;
				}
				return 0;
			});
	}, [balances]);

	const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
		return {
			...balance,
			formatted: balance.amount.toFixed(),
		};
	});

	return (
		<div {...rest}>
			{formattedBalances.map((balance) => {
				const usdValue = prices[balance.currency] * balance.amount;
				return (
					<WalletRow
						className={classes.row}
						key={`${balance.blockchain}`}
						amount={balance.amount}
						usdValue={usdValue}
						formattedAmount={balance.formatted}
					/>
				);
			})}
		</div>
	);
};
