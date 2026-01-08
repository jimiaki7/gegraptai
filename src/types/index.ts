// Type definitions for Gegraptai

export interface Book {
    id: string;
    name: string;
    abbrev: string;
    lang: 'hebrew' | 'aramaic' | 'greek';
    testament: 'OT' | 'NT';
}

export interface BibleReference {
    bookId: string;
    chapter: number;
    startVerse: number;
    endVerse: number | null;
}



export interface Word {
    id: string;
    verseRef: string;
    position: number;
    surfaceForm: string;
    lemma?: string;
    language: 'hebrew' | 'aramaic' | 'greek';
}

export interface Verse {
    reference: string;
    chapter: number;
    verse: number;
    words: Word[];
}

export interface Annotation {
    wordId: string;
    morphTag: string;
    exegeticalNote: string;
    updatedAt: number;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    fontSizeHebrew: number;
    fontSizeGreek: number;
    fontFamilyHebrew: string;
    fontFamilyGreek: string;
    lineHeight: number;
    showMorphUnderWords: boolean;
}

export interface AppState {
    currentReference: BibleReference | null;
    selectedWordId: string | null;
    verses: Verse[];
    annotations: Record<string, Annotation>;
    settings: UserSettings;
}
