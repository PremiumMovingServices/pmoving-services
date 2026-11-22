/**
 * Unique, hand-written SEO titles per service area.
 * Keys are the lower-cased `title` of the service area in the CMS.
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

export const defaultServiceAreaTitle = (city: string, stateName: string) =>
	`${city} Movers | Moving Services in ${city}, ${stateName}`;

export const getServiceAreaTitle = (city: string, stateName: string) =>
	SERVICE_AREA_TITLES[city.trim().toLowerCase()] ??
	defaultServiceAreaTitle(city, stateName);
