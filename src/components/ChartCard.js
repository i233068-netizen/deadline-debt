import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// White card wrapper with a title, used around each chart.
export default function ChartCard({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 12, marginVertical: 8 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 12, color: colors.muted, marginBottom: 8 },
});
