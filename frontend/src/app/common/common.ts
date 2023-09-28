import { environment } from "src/environments/environment";
import { EvahubDocumentTypeWordToNumber, EvahubMainMenuItem, PageIndexDictionary } from "./constants";

export function getDocumentTypeAsStringFromNumber(numberedDT: number) {
    return Object.keys(EvahubDocumentTypeWordToNumber).find(
        dt => numberedDT == EvahubDocumentTypeWordToNumber[dt]
    );
}

export function getDocumentTypeAsNumberFromString(dt: string) {
    return EvahubDocumentTypeWordToNumber[dt.toLowerCase()];
}

export function getPageNameFromPageIndex(i: number): string {
    return Object.keys(PageIndexDictionary).find(k => PageIndexDictionary[k].pageIndex == i);
}

export function getInitialMainMenuItems() {
    let toRet: EvahubMainMenuItem[] = [];
    Object.keys(PageIndexDictionary).forEach(k => {
        let immi = PageIndexDictionary[k];
        if (immi.isInMainMenu) {
            immi.isSelected = false;
            toRet.push(immi);
        }
    });

    return toRet;
}

/*
    Will change the words:
    "cAMEL", "CAMEL", "camel", "cAmEl", "CaMeL"
    to "Camel"
*/
export function capitalizeWord(word: string): string {
    word = word.toLowerCase();
    const flc = word.toUpperCase().substring(0, 1); // First Letter Capitalized
    const sc = flc + word.substring(1, word.length); // Capitalized word

    return sc;
}
