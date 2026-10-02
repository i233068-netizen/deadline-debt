import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { RECOVERY_DEBT_HOURS } from '../data/constants';

// Big card at the top of the dashboard. Colour + message depend on how large the debt is (3 states).
export default function DebtSummary({ debt, pendingHours, hoursPerDay }) {
  const isCritical = debt >= RECOVERY_DEBT_HOURS;
  const backgroundColor = isCritical ? colors.critical : debt > 0 ? colors.approaching : colors.later;
  const message = isCritical
    ? '⚠️ Your workload is becoming difficult to manage.'
    : debt > 0
    ? 'Workload is building up. Keep an eye on it.'
    : "✅ You're on track. No deadline debt right now.";

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.label}>Deadline Debt</Text>
      <Text style={styles.value}>{debt} hrs</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.detail}>
        {pendingHours}h of work pending • {hoursPerDay}h/day available
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 18, marginVertical: 8 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  value: { color: '#FFFFFF', fontSize: 40, fontWeight: '800' },
  message: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginTop: 4 },
  detail: { color: '#FFFFFF', fontSize: 12, marginTop: 8, opacity: 0.9 },
});
