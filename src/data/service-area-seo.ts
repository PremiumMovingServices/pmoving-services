/**
 * Unique, hand-written SEO titles per service area.
 * Keys are the lower-cased city name taken from the CMS `title` field.
 * The CMS title may carry a ZIP code after a comma (for example
 * "Lakeland, MN 55043"), so only the part before the first comma is used.
 * Any city not listed here falls back to `defaultServiceAreaTitle`.
 * Meta descriptions come from the first ~155 characters of each
 * city's CMS "description" field, so they stay unique per page.
 */
const SERVICE_AREA_TITLES: Record<string, string> = {
	minneapolis: "Minneapolis Movers | North Loop, Uptown & Northeast Moving",
	"saint paul": "Saint Paul MN Movers | Home, Apartment & Office Moving",
	rochester: "Rochester MN Movers | Home, Senior & Office Moving",
	maplewood: "Maplewood MN Movers | Home, Apartment & Office Moving",
	lakeville: "Lakeville MN Movers | Moving & Climate-Controlled Storage",
	mankato: "Mankato MN Movers | Home & Office Moving, Storage Warehouse",
	lakeland: "Lakeland MN Movers | Home & Office Moving on St. Croix Trail",
};

const cityName = (title: string) => title.split(",")[0]?.trim() ?? title.trim();

export const defaultServiceAreaTitle = (city: string, stateName: string) =>
	`${city} Movers | Moving Services in ${city}, ${stateName}`;

export const getServiceAreaTitle = (title: string, stateName: string) => {
	const city = cityName(title);
	return (
		SERVICE_AREA_TITLES[city.toLowerCase()] ??
		defaultServiceAreaTitle(city, stateName)
	);
};
