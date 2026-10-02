import { ScrollView, View, Text, Alert, StyleSheet } from 'react-native';
import { colors, urgencyColors } from '../theme';
import { ENERGY_EMOJI } from '../data/constants';
import { getUrgency, getDueLabel, formatMinutes } from '../utils/workload';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';

// One label/value line
function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function TaskDetailsScreen({ task, onBack, onToggleComplete, onDelete }) {
  const urgency = getUrgency(task.dueInDays);

  const confirmDelete = () => {
    Alert.alert('Delete task?', `"${task.name}" will be removed permanently.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Task Details" onBack={onBack} />
      <View style={styles.card}>
        <Text style={styles.name}>{task.name}</Text>
        <Text style={[styles.badge, { backgroundColor: task.completed ? colors.muted : urgencyColors[urgency] }]}>
          {task.completed ? 'Completed' : urgency}
        </Text>
        <DetailRow label="Course" value={task.course} />
        <DetailRow label="Due" value={getDueLabel(task.dueInDays)} />
        <DetailRow label="Estimated time" value={formatMinutes(task.estimatedMinutes)} />
        <DetailRow label="Difficulty" value={task.difficulty} />
        <DetailRow label="Energy required" value={`${ENERGY_EMOJI[task.energy]} ${task.energy}`} />
        <DetailRow label="Priority" value={task.priority} />
      </View>
      <AppButton
        title={task.completed ? '↩ Mark as Pending' : '✓ Mark as Complete'}
        color={task.completed ? colors.approaching : colors.later}
        onPress={() => onToggleComplete(task.id)}
      />
      <AppButton title="🗑 Delete Task" variant="outline" color={colors.critical} onPress={confirmDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  badge: { alignSelf: 'flex-start', color: '#FFFFFF', fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginVertical: 8, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { color: colors.muted, fontSize: 15 },
  detailValue: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
