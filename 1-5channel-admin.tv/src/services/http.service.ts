class HttpService {
    backendAddress = "http://1-5channel.tv"
    api = {
        banner: {
            get: "/api/banner/get.php",
            add: "/api/banner/add.php",
            change: "/api/banner/change.php",
            delete: "/api/banner/delete.php"
        },
        program: {
            get: "/api/program/get.php",
            add: "/api/program/add.php",
            change: "/api/program/change.php",
            delete: "/api/program/delete.php"
        },
        scheldule: {
            get: "/api/scheldule/get.php",
            change: "/api/scheldule/change.php"
        },
        page: {
            get: "/api/page/get.php",
            change: "/api/page/change.php"
        },
        commonSettings: {
            get: "/api/common_settings/get.php",
            change: "/api/common_settings/change.php"
        },
        auth: {
            login: "/api/auth/login.php",
            logout: "/api/auth/logout.php",
            checkToken: "/api/auth/check_token.php"
        }
    }
    getImgSrc(fileName: string) {
        if (fileName) return this.backendAddress + "/files/images/" + fileName;
        return this.backendAddress + "/files/images/noImage.png";
    }
    getVideoSrc(fileName: string) {
        return this.backendAddress + "/files/videos/" + fileName;
    }
}

export default new HttpService;