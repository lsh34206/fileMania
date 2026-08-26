export class LevelUtils {
    static nextThreshold(current: number): number {
        return current >= 100 ? Math.round(current * 1.2) : current + 10;
    }

    static computeLevel(xp: number): { level: number; maxXp: number } {
        let level = 1;
        let maxXp = 10;
        while (xp >= maxXp) {
            level++;
            maxXp = LevelUtils.nextThreshold(maxXp);
        }
        return { level, maxXp };
    }
}
