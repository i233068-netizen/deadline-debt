import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { ENERGY_EMOJI } from '../data/constants';
import { getDueLabel, formatMinutes } from '../utils/workload';
import AppButton from './AppButton';

// Shows the task suggested by "Find My Next Task". Button changes from Start to Complete.
export default function RecommendationCard({ task, debtReduction, started, onStart, onComplete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Recommended Task</Text>
      <Text style={styles.name}>{task.name}</Text>
      <Text style={styles.line}>⏱ {formatMinutes(task.estimatedMinutes)}</Text>
      <Text style={styles.line}>{ENERGY_EMOJI[task.energy]} {task.energy} energy</Text>
      <Text style={styles.line}>📅 Due: {getDueLabel(task.dueInDays)}</Text>
      <Text style={styles.line}>
        {debtReduction > 0
          ? `📉 Reduces deadline debt by ${debtReduction}h`
          : '✅ Keeps you ahead of your deadlines'}
      </Text>
      {started ? (
        <AppButton title="✓ Mark as Complete" onPress={onComplete} color={colors.later} />
      ) : (
        <AppButton title="▶ Start Task" onPress={onStart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginVertical: 10, borderWidth: 2, borderColor: colors.primary },
  heading: { color: colors.primary, fontWeight: '700', fontSize: 13, textTransform: 'uppercase' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginVertical: 6 },
  line: { fontSize: 15, color: colors.text, marginVertical: 2 },
});
