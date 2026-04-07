interface Props {
	title: string;
	description?: string;
	url?: string;
}

export const OGImage = ({ title, description, url = "t128n.dev" }: Props) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				backgroundColor: "#fafafa", // zinc-50
				color: "#09090b", // zinc-950
				fontFamily: "iA Writer Duo",
			}}
		>
			{/* Top section */}
			<div
				style={{
					display: "flex",
					flex: 1,
					borderBottom: "1px solid #e4e4e7", // zinc-200 / border-default
				}}
			>
				<div style={{ flex: 1, borderRight: "1px solid #e4e4e7" }} />
				<div style={{ width: "60rem" }} />
				<div style={{ flex: 1, borderLeft: "1px solid #e4e4e7" }} />
			</div>

			{/* Middle section (Content) */}
			<div
				style={{
					display: "flex",
					height: "400px",
				}}
			>
				<div style={{ flex: 1, borderRight: "1px solid #e4e4e7" }} />
				<div
					style={{
						width: "60rem",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						padding: "0 60px",
						gap: "16px",
					}}
				>
					<h1
						style={{
							fontSize: "72px",
							fontWeight: 700,
							margin: 0,
							lineHeight: 1.1,
						}}
					>
						{title}
					</h1>
					{description && (
						<p
							style={{
								fontSize: "32px",
								color: "#71717a", // zinc-500
								margin: 0,
								lineHeight: 1.4,
							}}
						>
							{description}
						</p>
					)}
				</div>
				<div style={{ flex: 1, borderLeft: "1px solid #e4e4e7" }} />
			</div>

			{/* Bottom section */}
			<div
				style={{
					display: "flex",
					flex: 1,
					borderTop: "1px solid #e4e4e7",
				}}
			>
				<div style={{ flex: 1, borderRight: "1px solid #e4e4e7" }} />
				<div
					style={{
						fontFamily: "iA Writer Mono",
						width: "60rem",
						display: "flex",
						alignItems: "center",
						padding: "0 60px",
						fontSize: "24px",
						color: "#a1a1aa", // zinc-400
					}}
				>
					{url}
				</div>
				<div style={{ flex: 1, borderLeft: "1px solid #e4e4e7" }} />
			</div>
		</div>
	);
};
