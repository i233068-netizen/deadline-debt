import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Label + controlled TextInput + inline error message.
export default function FormField({ label, value, onChangeText, placeholder, keyboardType, maxLength, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.text },
  inputError: { borderColor: colors.critical },
  error: { color: colors.critical, fontSize: 13, marginTop: 4 },
});
