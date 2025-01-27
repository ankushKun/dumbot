import fs from 'fs';

interface State {
    totalGms: number;
    gmCount: {
        [userId: string]: {
            [channelId: string]: {
                total: number;
                lastGm: Date;
                gmsThisWeek: number;
                gmsThisMonth: number;
                gmsThisYear: number;
                streak: number;
                updatedToday: boolean;
            };
        };
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

export function getGmCount(userId: string, channelId: string) {
    if (!state.gmCount[userId]) {
        state.gmCount[userId] = {};
    }
    if (!state.gmCount[userId][channelId]) {
        state.gmCount[userId][channelId] = { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 1, updatedToday: false };
    }
    const gmCount = state.gmCount[userId][channelId];
    gmCount.updatedToday = new Date(gmCount.lastGm).getDate() == new Date().getDate();
    return { ...gmCount, total: state.totalGms || 0 };
}

export function incrementGmCount(userId: string, channelId: string, streak: number) {
    if (!state.gmCount[userId]) {
        state.gmCount[userId] = {};
    }
    if (!state.gmCount[userId][channelId]) {
        state.gmCount[userId][channelId] = { total: 0, lastGm: new Date(), gmsThisWeek: 0, gmsThisMonth: 0, gmsThisYear: 0, streak: 1, updatedToday: true };
    }
    if (!state.totalGms) {
        state.totalGms = 0;
    }

    const isUpdatedToday = (new Date(state.gmCount[userId][channelId].lastGm)).getDate() == new Date().getDate();

    state.gmCount[userId][channelId].total++;
    state.gmCount[userId][channelId].lastGm = new Date();
    state.gmCount[userId][channelId].gmsThisWeek++;
    state.gmCount[userId][channelId].gmsThisMonth++;
    state.gmCount[userId][channelId].gmsThisYear++;
    state.totalGms++;
    state.gmCount[userId][channelId].streak = streak;
    state.gmCount[userId][channelId].updatedToday = isUpdatedToday;
    saveState();
}

///////////////////////////////////////////

export function resetWeeklyGmCount() {
    for (const userId in state.gmCount) {
        for (const channelId in state.gmCount[userId]) {
            state.gmCount[userId][channelId].gmsThisWeek = 0;
        }
    }
    console.log("Weekly reset");
    saveState();
}

export function resetMonthlyGmCount() {
    for (const userId in state.gmCount) {
        for (const channelId in state.gmCount[userId]) {
            state.gmCount[userId][channelId].gmsThisMonth = 0;
        }
    }
    console.log("Monthly reset");
    saveState();
}

export function resetYearlyGmCount() {
    for (const userId in state.gmCount) {
        for (const channelId in state.gmCount[userId]) {
            state.gmCount[userId][channelId].gmsThisYear = 0;
        }
    }
    console.log("Yearly reset");
    saveState();
}