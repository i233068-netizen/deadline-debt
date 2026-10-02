import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { FOCUS_TASK_COUNT, RECOVERY_DEBT_HOURS } from '../data/constants';
import { getPending, sortByUrgency, calculateDeadlineDebt } from '../utils/workload';
import ScreenHeader from '../components/ScreenHeader';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

export default function RecoveryScreen({ tasks, hoursPerDay, onBack, onOpenTask, onToggleComplete }) {
  const pending = getPending(tasks);
  const focusTasks = sortByUrgency(pending).slice(0, FOCUS_TASK_COUNT);

  const debtNow = calculateDeadlineDebt(tasks, hoursPerDay);
  // Debt if the focus tasks were finished
  const debtAfter = calculateDeadlineDebt(
    pending.filter((task) => !focusTasks.includes(task)),
    hoursPerDay
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Recovery Mode" onBack={onBack} />

      {focusTasks.length === 0 ? (
        <EmptyState emoji="📚" title="You're all caught up!" message="No deadline debt right now." />
      ) : (
        <>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>
              {debtNow >= RECOVERY_DEBT_HOURS ? '🚨 Your workload is building up' : '✅ Your workload is under control'}
            </Text>
            <Text style={styles.bannerText}>Focus on these {focusTasks.length} tasks first.</Text>
            <Text style={styles.bannerDebt}>
              Deadline Debt: {debtNow}h → {debtAfter}h
            </Text>
          </View>

          {focusTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onOpenTask(task.id)}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  banner: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: colors.critical },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: colors.critical },
  bannerText: { fontSize: 14, color: colors.text, marginTop: 4 },
  bannerDebt: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 8 },
});
