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