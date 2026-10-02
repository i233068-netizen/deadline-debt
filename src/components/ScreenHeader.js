import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Top header with a Back button, used on every screen except the dashboard.
export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { paddingVertical: 6, paddingRight: 14 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
});
