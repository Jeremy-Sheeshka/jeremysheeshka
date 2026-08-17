export function toggleClass(element: HTMLElement, className: string) {
	element.classList.toggle(className);
}

export function elementHasClass(element: HTMLElement, className: string) {
	return element.classList.contains(className);
}

export function rootInDarkMode() {
	return document.documentElement.getAttribute("data-theme") === "dark";
}

export function rootTheme(): "light" | "dark" | "raw" {
	const theme = document.documentElement.getAttribute("data-theme");
	return theme === "dark" || theme === "raw" ? theme : "light";
}
