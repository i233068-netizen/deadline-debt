import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Shown whenever there is no data to display.
export default function EmptyState({ emoji, title, message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  emoji: { fontSize: 44, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  message: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 6 },
});
