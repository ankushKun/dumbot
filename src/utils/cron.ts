import { schedule } from "node-cron"
import { resetMonthlyGmCount, resetWeeklyGmCount, resetYearlyGmCount } from "./state.js";

// every week at the start of the week
schedule("0 0 * * 0", () => {
    console.log("Weekly reset");
    resetWeeklyGmCount();
});

// every month at the start of the month
schedule("0 0 1 * *", () => {
    console.log("Monthly reset");
    resetMonthlyGmCount();
});

// every year at the start of the year
schedule("0 0 1 1 *", () => {
    console.log("Yearly reset");
    resetYearlyGmCount();
});
