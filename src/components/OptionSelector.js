import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Row of chips where exactly one is selected. Used for energy, difficulty, priority, filters and sorting.
export default function OptionSelector({ options, selected, onSelect }) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, option === selected && styles.chipActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.chipText, option === selected && styles.chipTextActive]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginRight: 8, marginBottom: 6 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
});
