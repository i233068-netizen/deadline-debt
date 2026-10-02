import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Small number card (used for urgency buckets and quick stats).
export default function StatCard({ label, value, color = colors.primary }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 12, borderTopWidth: 4, padding: 12, marginHorizontal: 4, alignItems: 'center' },
  value: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 12, color: colors.muted, marginTop: 2, textAlign: 'center' },
});
