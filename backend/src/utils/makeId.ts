import {randomUUID} from "crypto";

export class makeIdUtils {
    static makeId() {
        return randomUUID();
    }
}