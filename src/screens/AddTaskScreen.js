import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text, Alert, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { LEVELS, PRIORITIES } from '../data/constants';
import { validateTask } from '../utils/workload';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import OptionSelector from '../components/OptionSelector';
import AppButton from '../components/AppButton';

export default function AddTaskScreen({ onBack, onAddTask }) {
  // One state variable per input (controlled inputs)
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [dueDays, setDueDays] = useState('');
  const [minutes, setMinutes] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [energy, setEnergy] = useState('Medium');
  const [priority, setPriority] = useState('Normal');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = validateTask({ name, course, dueDays, minutes });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop: show the errors

    onAddTask({
      id: Date.now().toString(),
      name: name.trim(),
      course: course.trim(),
      dueInDays: Number(dueDays),
      estimatedMinutes: Number(minutes),
      difficulty,
      energy,
      priority,
      completed: false,
    });
    Alert.alert('Task added ✅', `"${name.trim()}" was added and your deadline debt was updated.`);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Add Task" onBack={onBack} />

        <FormField label="Task name" value={name} onChangeText={setName} placeholder="e.g. Database Assignment" maxLength={40} error={errors.name} />
        <FormField label="Course (short name)" value={course} onChangeText={setCourse} placeholder="e.g. DB" maxLength={10} error={errors.course} />
        <FormField label="Due in (days, 0 = today)" value={dueDays} onChangeText={setDueDays} placeholder="e.g. 2" keyboardType="number-pad" maxLength={2} error={errors.dueDays} />
        <FormField label="Estimated time (minutes)" value={minutes} onChangeText={setMinutes} placeholder="e.g. 90" keyboardType="number-pad" maxLength={3} error={errors.minutes} />

        <Text style={styles.label}>Difficulty</Text>
        <OptionSelector options={LEVELS} selected={difficulty} onSelect={setDifficulty} />
        <Text style={styles.label}>Energy required</Text>
        <OptionSelector options={LEVELS} selected={energy} onSelect={setEnergy} />
        <Text style={styles.label}>Priority (optional)</Text>
        <OptionSelector options={PRIORITIES} selected={priority} onSelect={setPriority} />

        <AppButton title="Add Task" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: 4 },
});
