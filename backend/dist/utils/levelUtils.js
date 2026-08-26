"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUtils = void 0;
class LevelUtils {
    static nextThreshold(current) {
        return current >= 100 ? Math.round(current * 1.2) : current + 10;
    }
    static computeLevel(xp) {
        let level = 1;
        let maxXp = 10;
        while (xp >= maxXp) {
            level++;
            maxXp = LevelUtils.nextThreshold(maxXp);
        }
        return { level, maxXp };
    }
}
exports.LevelUtils = LevelUtils;
//# sourceMappingURL=levelUtils.js.map