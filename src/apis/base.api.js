export default class BaseAPI{
    constructor(){
        this.version = "v1";
        this.baseURL = "https://api.elderscrollslegends.io/" + this.version + "/";
    }
    get(params){
        params = params || {};
        return fetch(this.url + "?" + new URLSearchParams(params));
    }
}