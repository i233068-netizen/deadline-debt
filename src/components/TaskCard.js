import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, urgencyColors } from '../theme';
import { ENERGY_EMOJI } from '../data/constants';
import { getUrgency, getDueLabel, formatMinutes } from '../utils/workload';

// One task row. The coloured left stripe shows urgency. onToggleComplete is optional.
export default function TaskCard({ task, onPress, onToggleComplete }) {
  const stripeColor = task.completed ? colors.muted : urgencyColors[getUrgency(task.dueInDays)];

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: stripeColor }]} onPress={onPress}>
      <View style={styles.info}>
        <Text style={[styles.name, task.completed && styles.doneText]}>{task.name}</Text>
        <Text style={styles.meta}>
          {task.course} • {getDueLabel(task.dueInDays)} • {formatMinutes(task.estimatedMinutes)}
        </Text>
        <Text style={styles.meta}>
          {ENERGY_EMOJI[task.energy]} {task.energy} energy
          {task.priority === 'High' ? '  •  ⭐ High priority' : ''}
        </Text>
      </View>
      {onToggleComplete ? (
        <TouchableOpacity style={styles.toggle} onPress={() => onToggleComplete(task.id)}>
          <Text style={styles.toggleText}>{task.completed ? '↩' : '✓'}</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, borderLeftWidth: 6, padding: 12, marginVertical: 5 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  doneText: { textDecorationLine: 'line-through', color: colors.muted },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  toggle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  toggleText: { fontSize: 18, color: colors.primary, fontWeight: '800' },
});
