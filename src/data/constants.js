// All "tweakable" numbers live here, so a live change in the viva is one line.

export const CRITICAL_DAYS = 1; // due within 1 day  -> Critical
export const APPROACHING_DAYS = 4; // due within 4 days -> Approaching, otherwise Later
export const DUE_SOON_DAYS = 2; // "due within 48 hours"
export const RECOVERY_DEBT_HOURS = 1.5; // debt at/above this -> Recovery Mode is suggested
export const FOCUS_TASK_COUNT = 3; // how many tasks Recovery Mode shows

export const MIN_HOURS_PER_DAY = 1;
export const MAX_HOURS_PER_DAY = 12;

export const LEVELS = ['Low', 'Medium', 'High'];
export const PRIORITIES = ['Normal', 'High'];

// Numbers let us compare energy levels: a Low-energy student can't do a High-energy task.
export const ENERGY_LEVEL = { Low: 1, Medium: 2, High: 3 };
export const ENERGY_EMOJI = { Low: '🔋', Medium: '⚡', High: '🚀' };
