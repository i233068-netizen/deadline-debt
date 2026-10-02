# Deadline Debt: Smart Academic Workload Manager

**Course:** Software for Mobile Devices, Assignment 1
**Student:Ayesha Naveed | **Reg. No.:23i-3068

## Problem
Students often have several assignments, quizzes and labs due around the same time. A normal to-do list shows *what* is pending, but not how overloaded the student is or what to work on right now.

## Solution
The app treats unfinished work as **deadline debt**: the amount of work that cannot realistically be finished with the study time available before the deadlines. It then recommends a task based on **time available, current energy and urgency**.

## Major Features
- **Dashboard:** deadline debt card (green / orange / red), work grouped as Critical / Approaching / Later, tasks due within 48 hours, progress bar, a **bar chart** (workload by course) and a **line chart** (workload burn-down) using `react-native-chart-kit`.
- **Study time per day (+/−):** changes the debt and charts instantly.
- **Add Task form:** name, course, due in days, estimated minutes, difficulty, energy, priority, with validation and error messages.
- **All Tasks:** search, status filter (All / Pending / Done), sorting (Deadline / Shortest), complete or un-complete tasks.
- **Find My Next Task:** enter minutes available and energy level; the app recommends the most urgent suitable task. Start, then Complete, and the debt drops.
- **Recovery Mode:** appears when debt is high; shows only the 3 most urgent tasks and "debt now → debt after".
- **Task Details:** view, mark complete / pending, delete with confirmation.
- **Empty states:** no tasks, all caught up, no search results, no suitable task.

## How It Works
- **Screen switching:** no navigation library and no side or bottom bars. `App.js` keeps a `screen` state and shows the matching screen with conditional rendering.
- **Deadline debt:** for each deadline, compare the work due by then with the study hours available by then (`hoursPerDay × (days + 1)`). Debt is the largest shortfall, never below 0.
- **Recommendation:** keep unfinished tasks that fit the time available and need no more energy than the chosen level, then choose the one with the nearest deadline.

## Project Structure
```
App.js                  screen, tasks and study-hours state; handlers
src/
  theme.js              colours
  data/                 sampleTasks.js (static data), constants.js (thresholds)
  utils/workload.js     debt, urgency, chart data, recommendation, validation
  components/           AppButton, ScreenHeader, EmptyState, StatCard, ChartCard,
                        OptionSelector, FormField, TaskCard, DebtSummary,
                        RecommendationCard
  screens/              Dashboard, Tasks, AddTask, TaskDetails, Recommend, Recovery
```

## Setup and Run
Requires Node.js and the **Expo Go** app on your phone (tested with Expo SDK 57).

```bash
npm install
npx expo start
```
Scan the QR code with Expo Go (phone and computer on the same Wi-Fi). If it cannot connect, use `npx expo start --tunnel`.

