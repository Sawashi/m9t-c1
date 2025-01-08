// src/utils/loadIcons.ts
const icons = import.meta.glob("../assets/icons/*.svg", { eager: true });

const svgIcons: Record<string, string> = {};
for (const path in icons) {
	const iconName = path.split("/").pop()?.replace(".svg", "") || "";
	svgIcons[iconName] = (icons[path] as { default: string }).default;
}

export default svgIcons;
