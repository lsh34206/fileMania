"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIdUtils = void 0;
const crypto_1 = require("crypto");
class makeIdUtils {
    static makeId() {
        return (0, crypto_1.randomUUID)();
    }
}
exports.makeIdUtils = makeIdUtils;
//# sourceMappingURL=makeId.js.map