// src/components/Icon.tsx
import React from "react";
import svgIcons from "../utils/loadIcons";

interface IconProps {
	name: string;
	alt?: string;
	width?: number | string;
	height?: number | string;
}

const Icon: React.FC<IconProps> = ({
	name,
	alt,
	width = 24,
	height = 24,
	...props
}) => {
	const iconSrc = svgIcons[name];

	if (!iconSrc) {
		console.warn(`Icon "${name}" not found.`);
		return null;
	}

	return (
		<img
			src={iconSrc}
			alt={alt || name}
			width={width}
			height={height}
			{...props}
		/>
	);
};

export default Icon;
