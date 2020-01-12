
class CommonService {
    ytApiLoaded = false;

    constructor() {
        (window as any).onYouTubeIframeAPIReady = () => this.ytApiLoaded = true;
    }
}

export default new CommonService;