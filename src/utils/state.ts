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
    const sorted = Object.entries(state.gmCount).sort((a: [string, UserGmCount], b: [string, UserGmCount]) => b[1].streak - a[1].streak);
    return sorted.slice(0, 10);
}

export function getGmCount(userId: string, channelId: string) {
    if (!state.gmCount[userId]) {
        return { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 0, updatedToday: false };
    }
    const gmCount = state.gmCount[userId];
    gmCount.updatedToday = new Date(gmCount.lastGm).getDate() == new Date().getDate();
    return { ...gmCount, total: state.totalGms || 0 };
}

export function incrementGmCount(userId: string, channelId: string, streak: number) {
    if (!state.gmCount[userId]) {
        state.gmCount[userId] = { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 1, updatedToday: true };
    }

    if (!state.totalGms) {
        state.totalGms = 0;
    }

    const isUpdatedToday = (new Date(state.gmCount[userId].lastGm)).getDate() == new Date().getDate();

    state.gmCount[userId].total++;
    state.gmCount[userId].lastGm = new Date();
    state.gmCount[userId].gmsThisWeek++;
    state.gmCount[userId].gmsThisMonth++;
    state.gmCount[userId].gmsThisYear++;
    state.totalGms++;
    state.gmCount[userId].streak = streak;
    state.gmCount[userId].updatedToday = isUpdatedToday;
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