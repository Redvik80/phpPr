export interface Program {
    id: number;
    name: string;
    duration: number;
    file_name: string;
    youtube_id: string;
    from_youtube: boolean;
    newFile?: NewFile;
}

export interface NewFile {
    dataUrl: string;
    extension: string;
}

export class SchelduleItem {
    id: number;
    date: number;
    order: number;
    program_id?: number;
    program?: CutedProgram;
    time?: {
        hours: number,
        minutes: number,
        str: string,
        isValid: boolean
    };
}

export class CutedProgram {
    id: number;
    name: string;
    duration: number;
}

export interface Banner {
    id: number;
    title: string;
    description: string;
    file_name: string;
    newFile?: NewFile;
}

export interface CutedBanner {
    id: number;
    title: string;
    checked?: boolean;
}

export interface Page {
    id: number;
    navigation_name: string;
    title: string;
    description: string;
    banners_id: number[];
    banners?: CutedBanner[];
}

export interface CommonSettingsData {
    head_title: string;
    favicon_file_name: string;
    logo_file_name: string;
    newFavicon?: NewFile;
    newLogo?: NewFile;
}