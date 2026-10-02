import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Reusable button. variant="outline" gives a hollow style.
export default function AppButton({ title, onPress, color = colors.primary, variant = 'solid', disabled = false }) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? { borderColor: color, borderWidth: 2 } : { backgroundColor: color },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: isOutline ? color : '#FFFFFF' }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginVertical: 4 },
  text: { fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.4 },
});
