import fs from 'fs';

interface UserGmCount {
    total: number;
    lastGm: Date;
    gmsThisWeek: number;
    gmsThisMonth: number;
    gmsThisYear: number;
    streak: number;
    updatedToday: boolean;
}

interface State {
    totalGms: number;
    gmCount: {
        [userId: string]: UserGmCount;
    };
}

let state: State;

export function loadState() {
    if (!fs.existsSync('state.json')) {
        state = { totalGms: 0, gmCount: {} };
        saveState();
    }
    state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
    console.log("State loaded");
    return state;
}

export function saveState() {
    fs.writeFileSync('state.json', JSON.stringify(state, null, 2));
    console.log("State saved");
}

///////////////////////////////////////////

export function top10gmStreak() {
    // Filter out users with zero or undefined streaks
    const validUsers = Object.entries(state.gmCount).filter(
        ([_, gmCount]) => gmCount.streak && gmCount.streak > 0
    );

    // Sort by streak (highest first)
    const sorted = validUsers.sort(
        (a: [string, UserGmCount], b: [string, UserGmCount]) => b[1].streak - a[1].streak
    );

    // Return top 10
    return sorted.slice(0, 10);
}

export function getGmCount(userId: string, channelId: string) {
    if (!state.gmCount[userId]) {
        return { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 0, updatedToday: false };
    }
    const gmCount = state.gmCount[userId];
    gmCount.updatedToday = new Date(gmCount.lastGm).getDate() === new Date().getDate() &&
        new Date(gmCount.lastGm).getMonth() === new Date().getMonth() &&
        new Date(gmCount.lastGm).getFullYear() === new Date().getFullYear();
    return { ...gmCount };
}

export function incrementGmCount(userId: string, channelId: string, streak: number) {
    if (!state.gmCount[userId]) {
        state.gmCount[userId] = { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 1, updatedToday: true };
    }

    if (!state.totalGms) {
        state.totalGms = 0;
    }

    const today = new Date();
    const lastGmDate = new Date(state.gmCount[userId].lastGm);
    const isUpdatedToday = lastGmDate.getDate() === today.getDate() &&
        lastGmDate.getMonth() === today.getMonth() &&
        lastGmDate.getFullYear() === today.getFullYear();

    // Only increment counts if not already updated today
    if (!isUpdatedToday) {
        state.gmCount[userId].total++;
        state.gmCount[userId].gmsThisWeek++;
        state.gmCount[userId].gmsThisMonth++;
        state.gmCount[userId].gmsThisYear++;
        state.totalGms++;
    }

    state.gmCount[userId].lastGm = new Date();
    state.gmCount[userId].streak = streak;
    state.gmCount[userId].updatedToday = true;
    saveState();
}

///////////////////////////////////////////

export function resetWeeklyGmCount() {
    for (const userId in state.gmCount) {
        state.gmCount[userId].gmsThisWeek = 0;
    }
    console.log("Weekly reset");
    saveState();
}

export function resetMonthlyGmCount() {
    for (const userId in state.gmCount) {
        state.gmCount[userId].gmsThisMonth = 0;
    }
    console.log("Monthly reset");
    saveState();
}

export function resetYearlyGmCount() {
    for (const userId in state.gmCount) {
        state.gmCount[userId].gmsThisYear = 0;
    }
    console.log("Yearly reset");
    saveState();
}