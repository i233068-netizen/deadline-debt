import {
  CRITICAL_DAYS,
  APPROACHING_DAYS,
  ENERGY_LEVEL,
} from '../data/constants';

const round1 = (n) => Math.round(n * 10) / 10;

export function getPending(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function sumMinutes(tasks) {
  return tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
}

export function minutesToHours(minutes) {
  return round1(minutes / 60);
}

export function formatMinutes(minutes) {
  return minutes < 60 ? `${minutes} min` : `${round1(minutes / 60)} h`;
}

export function getDueLabel(dueInDays) {
  if (dueInDays === 0) return 'Today';
  if (dueInDays === 1) return 'Tomorrow';
  return `In ${dueInDays} days`;
}

export function getUrgency(dueInDays) {
  if (dueInDays <= CRITICAL_DAYS) return 'Critical';
  if (dueInDays <= APPROACHING_DAYS) return 'Approaching';
  return 'Later';
}

// Nearest deadline first. If tied: High priority first. If still tied: longer task first.
export function sortByUrgency(tasks) {
  const priorityRank = (task) => (task.priority === 'High' ? 0 : 1);
  return [...tasks].sort(
    (a, b) =>
      a.dueInDays - b.dueInDays ||
      priorityRank(a) - priorityRank(b) ||
      b.estimatedMinutes - a.estimatedMinutes
  );
}

/*
 * DEADLINE DEBT
 * For every deadline, compare:
 *   work that must be finished by then   vs   hours the student can study by then
 * available hours by day d = hoursPerDay * (d + 1)   (today counts as a day)
 * Debt is the worst shortfall found (never below 0).
 */
export function calculateDeadlineDebt(tasks, hoursPerDay) {
  const pending = getPending(tasks);
  let debt = 0;
  pending.forEach((task) => {
    const dueByThen = pending.filter((t) => t.dueInDays <= task.dueInDays);
    const workloadHours = sumMinutes(dueByThen) / 60;
    const availableHours = hoursPerDay * (task.dueInDays + 1);
    debt = Math.max(debt, workloadHours - availableHours);
  });
  return round1(debt);
}

// Hours of pending work in each urgency bucket.
export function getBucketHours(tasks) {
  const pending = getPending(tasks);
  const hoursFor = (urgency) =>
    minutesToHours(
      sumMinutes(pending.filter((task) => getUrgency(task.dueInDays) === urgency))
    );
  return {
    Critical: hoursFor('Critical'),
    Approaching: hoursFor('Approaching'),
    Later: hoursFor('Later'),
  };
}

// Data for the bar chart: pending hours per course.
export function getWorkloadByCourse(tasks) {
  const minutesByCourse = getPending(tasks).reduce((totals, task) => {
    totals[task.course] = (totals[task.course] || 0) + task.estimatedMinutes;
    return totals;
  }, {});
  const labels = Object.keys(minutesByCourse);
  return {
    labels,
    hours: labels.map((course) => minutesToHours(minutesByCourse[course])),
  };
}

// Data for the line chart: pending work left if the student studies hoursPerDay every day.
export function getBurnDown(tasks, hoursPerDay) {
  const totalHours = sumMinutes(getPending(tasks)) / 60;
  const days = [0, 1, 2, 3, 4];
  return {
    labels: days.map((day) => (day === 0 ? 'Now' : `Day ${day}`)),
    values: days.map((day) => round1(Math.max(0, totalHours - hoursPerDay * day))),
  };
}

/*
 * RECOMMENDATION
 * A task is a candidate if: not completed AND fits in the time AND needs no more energy than the student has.
 * Among candidates we pick the most urgent one.
 */
export function findRecommendation(tasks, availableMinutes, energy) {
  const candidates = getPending(tasks).filter(
    (task) =>
      task.estimatedMinutes <= availableMinutes &&
      ENERGY_LEVEL[task.energy] <= ENERGY_LEVEL[energy]
  );
  return sortByUrgency(candidates)[0] || null;
}

// How much would deadline debt drop if this task was completed?
export function getDebtReduction(tasks, taskId, hoursPerDay) {
  const before = calculateDeadlineDebt(tasks, hoursPerDay);
  const remaining = tasks.filter((task) => task.id !== taskId);
  const after = calculateDeadlineDebt(remaining, hoursPerDay);
  return round1(before - after);
}

// Returns an object of error messages. Empty object = form is valid.
export function validateTask(form) {
  const errors = {};
  if (form.name.trim() === '') errors.name = 'Task name is required.';
  if (form.course.trim() === '') errors.course = 'Course is required.';

  if (!/^\d+$/.test(form.dueDays)) {
    errors.dueDays = 'Enter a whole number of days (0 = today).';
  } else if (Number(form.dueDays) > 30) {
    errors.dueDays = 'Due date must be within 30 days.';
  }

  if (!/^\d+$/.test(form.minutes) || Number(form.minutes) === 0) {
    errors.minutes = 'Estimated time must be greater than 0.';
  } else if (Number(form.minutes) > 480) {
    errors.minutes = 'Estimated time cannot exceed 480 minutes. Split it into smaller tasks.';
  }
  return errors;
}
