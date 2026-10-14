export const SITE_URL = "https://www.andresbenitez.lat";

const WA_NUMBER = "573504407192";

export const wa = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
