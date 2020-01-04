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