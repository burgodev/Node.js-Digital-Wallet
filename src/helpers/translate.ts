import i18next from "i18next";
import { l } from "./logs";

export const setLang = async (lang: string): Promise<void> => {
    await i18next.changeLanguage(lang);
};

export const translateExists = (key: string | string[]): boolean => {
    return i18next.exists(key);
};

export const t = (key: string): string => {
    if (translateExists(key)) {
        return i18next.t(key);
    } else {
        l.warn("translation not found", { key });
    }
    return "";
};
