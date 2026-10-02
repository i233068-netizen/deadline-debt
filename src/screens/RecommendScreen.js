import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { LEVELS } from '../data/constants';
import { findRecommendation, calculateDeadlineDebt, getDebtReduction } from '../utils/workload';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import OptionSelector from '../components/OptionSelector';
import RecommendationCard from '../components/RecommendationCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';

export default function RecommendScreen({ tasks, hoursPerDay, onBack, onToggleComplete }) {
  const [minutes, setMinutes] = useState('');
  const [energy, setEnergy] = useState('Medium');
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); // has the student pressed "Find" yet?
  const [recommended, setRecommended] = useState(null); // task or null (= nothing suitable)
  const [started, setStarted] = useState(false);
  const [doneMessage, setDoneMessage] = useState('');

  const handleFind = () => {
    if (!/^\d+$/.test(minutes) || Number(minutes) === 0) {
      setError('Enter the minutes you have available (more than 0).');
      return;
    }
    setError('');
    setDoneMessage('');
    setStarted(false);
    setRecommended(findRecommendation(tasks, Number(minutes), energy));
    setSearched(true);
  };

  const handleComplete = () => {
    const reduction = getDebtReduction(tasks, recommended.id, hoursPerDay);
    onToggleComplete(recommended.id);
    setDoneMessage(`🎉 Task completed! Deadline debt reduced by ${reduction}h.`);
    setRecommended(null);
    setSearched(false);
    setStarted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="What Should I Do Now?" onBack={onBack} />
      <Text style={styles.debtText}>Current deadline debt: {calculateDeadlineDebt(tasks, hoursPerDay)}h</Text>

      <FormField
        label="Time available (minutes)"
        value={minutes}
        onChangeText={setMinutes}
        placeholder="e.g. 30"
        keyboardType="number-pad"
        maxLength={3}
        error={error}
      />
      <Text style={styles.label}>Current energy</Text>
      <OptionSelector options={LEVELS} selected={energy} onSelect={setEnergy} />
      <AppButton title="🎯 Find My Next Task" onPress={handleFind} />

      {doneMessage !== '' ? (
        <View style={styles.doneBox}>
          <Text style={styles.doneText}>{doneMessage}</Text>
        </View>
      ) : null}

      {searched && recommended ? (
        <RecommendationCard
          task={recommended}
          debtReduction={getDebtReduction(tasks, recommended.id, hoursPerDay)}
          started={started}
          onStart={() => setStarted(true)}
          onComplete={handleComplete}
        />
      ) : null}

      {searched && !recommended ? (
        <EmptyState
          emoji="🤔"
          title="No suitable task found."
          message="Try increasing your available time or choose a lower-energy task."
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  debtText: { color: colors.muted, marginBottom: 12, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  doneBox: { backgroundColor: '#DCFCE7', borderRadius: 12, padding: 14, marginTop: 10 },
  doneText: { color: '#166534', fontWeight: '700', fontSize: 15 },
});
