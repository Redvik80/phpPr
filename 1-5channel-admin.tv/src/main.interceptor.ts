import httpS from "./services/http.service"

export default (request: any, next: any) => {
    if (request.url.startsWith("/")) {
        // request.headers.set('Authorization', localStorage.getItem("token"));
        request.url = httpS.backendAddress + request.url;
    }
    next();
}