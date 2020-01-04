class HttpService {
    backendAddress = "http://1-5channel.tv"
    resources = {
        advertising: {
            getAll: "/api/advertising/getAll.php",
            add: "/api/advertising/add.php",
            change: "/api/advertising/change.php",
            delete: "/api/advertising/delete.php"
        },
        program: {
            getAll: "/api/program/getAll.php",
            add: "/api/program/add.php",
            change: "/api/program/change.php",
            delete: "/api/program/delete.php"
        },
        scheldule: {
            getAll: "/api/scheldule/getAll.php",
            change: "/api/scheldule/change.php",
        },
        homePage: {},
        commonSettings: {}
    }
    getImgSrc(fileName: string) {
        return this.backendAddress + "/files/images/" + fileName;
    }
    getVideoSrc(fileName: string) {
        return this.backendAddress + "/files/videos/" + fileName;
    }
}

export default new HttpService;