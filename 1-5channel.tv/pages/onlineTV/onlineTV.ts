import "./onlineTV.scss";
import { videosSrcRoot } from "../global";

declare var YT;

function onYouTubeIframeAPIReady() {

}

class OnlineTvPage {
    currentProgram: SchelduleItem;
    nextProgram: SchelduleItem;

    ytPlayer;
    htmlPlayer = document.getElementById("html-player") as HTMLVideoElement;
    playerHeader = document.getElementById("player-header") as HTMLElement;
    noSignalImg = document.getElementById("no-signal-img") as HTMLElement;

    ytPlayerLoaded = false;

    constructor() {
        fetch("/api/scheldule/getCurrentSchelduleData.php").then((res: Response) => res.json()).then(
            (data: { currentProgram: SchelduleItem, nextProgram: SchelduleItem }) => {
                this.currentProgram = data.currentProgram;
                this.nextProgram = data.nextProgram;
                if (this.ytPlayerLoaded) this.play();
            }
        );

        this.createYtPlayer();
        this.createHtmlPlayer();
    }

    createHtmlPlayer() {
        this.htmlPlayer.addEventListener("ended", () => {
            this.next();
        });
        this.htmlPlayer.addEventListener("playing", () => {
            this.htmlPlayer.muted = false;
            this.htmlPlayer.controls = true;
        });
    }

    createYtPlayer() {
        (window as any).onYouTubeIframeAPIReady = () => {
            this.ytPlayer = new YT.Player("yt-player", {
                videoId: "",
                playerVars: {
                    //controls: 0,
                    color: "white",
                    disablekb: 1,
                    enablejsapi: 1,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: () => {
                        this.ytPlayerLoaded = true;
                        this.play();
                    },
                    onStateChange: (event) => {
                        if (event.data === 0) {
                            this.next();
                        }
                    }
                }
            });
        }
    }

    next() {
        if (+(new Date) >= this.currentProgram.endTime.timestamp) {
            this.currentProgram = this.nextProgram;
            this.nextProgram = null;
            fetch("/api/scheldule/getCurrentSchelduleData.php").then((res: Response) => res.json()).then(
                (data: { currentProgram: SchelduleItem, nextProgram: SchelduleItem }) => {
                    let programOutdated = !this.currentProgram || data.currentProgram || this.currentProgram.program.id !== data.currentProgram.program.id;
                    this.currentProgram = data.currentProgram;
                    this.nextProgram = data.nextProgram;
                    if (programOutdated) {
                        this.play();
                    } else if (this.nextProgram) {
                        this.playerHeader.innerHTML += "<br><b>Далее: </b>" + this.nextProgram.program.name;
                    }
                }
            );
        }
        this.play();
    }

    play() {
        if (this.currentProgram) {
            this.noSignalImg.style.display = "none";
            const startSeconds = Math.floor(+(new Date) / 1000) - this.currentProgram.startTime.timestamp;
            if (this.currentProgram.program.from_youtube) {
                this.htmlPlayer.pause();
                this.htmlPlayer.style.display = "none";
                this.ytPlayer.getIframe().style.display = "block";
                this.ytPlayer.loadVideoById(this.currentProgram.program.youtube_id, startSeconds);
            } else {
                this.ytPlayer.pauseVideo();
                this.ytPlayer.getIframe().style.display = "none";
                this.htmlPlayer.style.display = "block";
                this.htmlPlayer.src = videosSrcRoot + this.currentProgram.program.file_name;
                this.htmlPlayer.currentTime = startSeconds;
                this.htmlPlayer.play();
            }
            this.playerHeader.innerHTML = "<b>Сейчас в эфире: </b>" + this.currentProgram.program.name;
            if (this.nextProgram) {
                this.playerHeader.innerHTML += "<br><b>Далее: </b>" + this.nextProgram.program.name;
            }
        } else {
            this.htmlPlayer.pause();
            this.ytPlayer.pauseVideo();
            this.htmlPlayer.style.display = "none";
            this.ytPlayer.getIframe().style.display = "none";
            this.playerHeader.innerHTML = "";
            this.noSignalImg.style.display = "block";
        }
    }
}

new OnlineTvPage();


interface Program {
    id: number;
    name: string;
    duration: number;
    file_name: string;
    youtube_id: string;
    from_youtube: boolean;
}

interface SchelduleItem {
    program: Program;
    startTime: {
        timestamp: number,
        hours: number,
        minutes: number,
        seconds: number
    };
    endTime: {
        timestamp: number,
        hours: number,
        minutes: number,
        seconds: number
    }
}