import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { colors } from '../theme';
import {
  DUE_SOON_DAYS,
  RECOVERY_DEBT_HOURS,
  MIN_HOURS_PER_DAY,
  MAX_HOURS_PER_DAY,
} from '../data/constants';
import {
  getPending,
  sumMinutes,
  minutesToHours,
  calculateDeadlineDebt,
  getBucketHours,
  getWorkloadByCourse,
  getBurnDown,
  sortByUrgency,
} from '../utils/workload';
import DebtSummary from '../components/DebtSummary';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';

const chartWidth = Dimensions.get('window').width - 56;

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
};

export default function DashboardScreen({ tasks, hoursPerDay, onChangeHours, onNavigate, onOpenTask }) {
  // Everything below is DERIVED from props, so it updates whenever tasks or hoursPerDay change.
  const pending = getPending(tasks);
  const debt = calculateDeadlineDebt(tasks, hoursPerDay);
  const pendingHours = minutesToHours(sumMinutes(pending));
  const buckets = getBucketHours(tasks);
  const byCourse = getWorkloadByCourse(tasks);
  const burnDown = getBurnDown(tasks, hoursPerDay);
  const dueSoon = sortByUrgency(pending.filter((task) => task.dueInDays <= DUE_SOON_DAYS));
  const completedCount = tasks.length - pending.length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{greeting} 👋</Text>
      <Text style={styles.subtitle}>Your Academic Load</Text>

      <DebtSummary debt={debt} pendingHours={pendingHours} hoursPerDay={hoursPerDay} />

      {debt >= RECOVERY_DEBT_HOURS ? (
        <AppButton title="🚨 Enter Recovery Mode" color={colors.critical} onPress={() => onNavigate('recovery')} />
      ) : null}

      {/* Study time per day: changes the debt calculation */}
      <View style={styles.hoursRow}>
        <Text style={styles.hoursLabel}>Study time per day</Text>
        <View style={styles.hoursControls}>
          <TouchableOpacity
            style={styles.hoursButton}
            onPress={() => onChangeHours(-0.5)}
            disabled={hoursPerDay <= MIN_HOURS_PER_DAY}
          >
            <Text style={styles.hoursButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.hoursValue}>{hoursPerDay}h</Text>
          <TouchableOpacity
            style={styles.hoursButton}
            onPress={() => onChangeHours(0.5)}
            disabled={hoursPerDay >= MAX_HOURS_PER_DAY}
          >
            <Text style={styles.hoursButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <StatCard label="🔴 Critical" value={`${buckets.Critical}h`} color={colors.critical} />
        <StatCard label="🟠 Approaching" value={`${buckets.Approaching}h`} color={colors.approaching} />
        <StatCard label="🟢 Later" value={`${buckets.Later}h`} color={colors.later} />
      </View>

      <View style={styles.row}>
        <StatCard label="Due within 48 hrs" value={`${dueSoon.length} tasks`} color={colors.critical} />
        <StatCard label="Today's progress" value={`${completedCount} / ${tasks.length}`} color={colors.later} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {pending.length === 0 ? (
        <EmptyState
          emoji="📚"
          title="You're all caught up!"
          message="No deadline debt right now. Add a task to get started."
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Due Soon</Text>
          {dueSoon.length === 0 ? (
            <Text style={styles.noneText}>Nothing due in the next 48 hours 🎉</Text>
          ) : (
            dueSoon.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} onPress={() => onOpenTask(task.id)} />
            ))
          )}

          <ChartCard title="Workload by Course" subtitle="Hours of unfinished work per course">
            <BarChart
              data={{ labels: byCourse.labels, datasets: [{ data: byCourse.hours }] }}
              width={chartWidth}
              height={200}
              yAxisLabel=""
              yAxisSuffix="h"
              fromZero
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </ChartCard>

          <ChartCard
            title="Workload Burn-down"
            subtitle={`Work left if you study ${hoursPerDay}h every day`}
          >
            <LineChart
              data={{ labels: burnDown.labels, datasets: [{ data: burnDown.values }] }}
              width={chartWidth}
              height={200}
              yAxisSuffix="h"
              fromZero
              bezier
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </ChartCard>
        </>
      )}

      <AppButton title="🎯 Find My Next Task" onPress={() => onNavigate('recommend')} />
      <AppButton title="📋 All Tasks" variant="outline" onPress={() => onNavigate('tasks')} />
      <AppButton title="➕ Add Task" variant="outline" onPress={() => onNavigate('add')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  greeting: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted },
  row: { flexDirection: 'row', marginVertical: 4 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, marginVertical: 6 },
  hoursLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  hoursControls: { flexDirection: 'row', alignItems: 'center' },
  hoursButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  hoursButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  hoursValue: { fontSize: 18, fontWeight: '700', color: colors.text, marginHorizontal: 12 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, marginHorizontal: 4, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.later },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 14 },
  noneText: { color: colors.muted, marginVertical: 8 },
  chart: { borderRadius: 12 },
});
