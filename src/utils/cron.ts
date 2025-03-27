import { schedule } from "node-cron"
import { loadState, resetMonthlyGmCount, resetWeeklyGmCount, resetYearlyGmCount, saveState } from "./state.js";

// Make sure state is loaded before scheduling jobs
loadState();

// every week at the start of the week (Sunday at midnight)
schedule("0 0 * * 0", () => {
    try {
        console.log("Running weekly reset at", new Date().toISOString());
        resetWeeklyGmCount();
        console.log("Weekly reset completed successfully");
    } catch (error) {
        console.error("Error during weekly reset:", error);
    }
});

// every month at the start of the month
schedule("0 0 1 * *", () => {
    try {
        console.log("Running monthly reset at", new Date().toISOString());
        resetMonthlyGmCount();
        console.log("Monthly reset completed successfully");
    } catch (error) {
        console.error("Error during monthly reset:", error);
    }
});

// every year at the start of the year
schedule("0 0 1 1 *", () => {
    try {
        console.log("Running yearly reset at", new Date().toISOString());
        resetYearlyGmCount();
        console.log("Yearly reset completed successfully");
    } catch (error) {
        console.error("Error during yearly reset:", error);
    }
});
