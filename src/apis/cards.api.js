import { sup } from "global-prefix";
import BaseAPI from "./base.api";
export default class CardsAPI extends BaseAPI{
    constructor(){
        super();
        this.url = this.baseURL + "/cards";
    }
}