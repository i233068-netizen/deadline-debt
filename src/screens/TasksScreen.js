import { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { sortByUrgency } from '../utils/workload';
import ScreenHeader from '../components/ScreenHeader';
import TaskCard from '../components/TaskCard';
import OptionSelector from '../components/OptionSelector';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';

const STATUS_OPTIONS = ['All', 'Pending', 'Done'];
const SORT_OPTIONS = ['Deadline', 'Shortest'];

export default function TasksScreen({ tasks, onBack, onNavigate, onOpenTask, onToggleComplete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Deadline');

  // 1) search by name or course  2) filter by status  3) sort
  const query = search.trim().toLowerCase();
  const visibleTasks = tasks
    .filter((task) => task.name.toLowerCase().includes(query) || task.course.toLowerCase().includes(query))
    .filter((task) => (statusFilter === 'All' ? true : statusFilter === 'Done' ? task.completed : !task.completed));

  const sortedTasks =
    sortBy === 'Deadline'
      ? sortByUrgency(visibleTasks)
      : [...visibleTasks].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

  return (
    <View style={styles.container}>
      <ScreenHeader title="All Tasks" onBack={onBack} />

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search by task or course..."
        placeholderTextColor={colors.muted}
      />
      <OptionSelector options={STATUS_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} />
      <OptionSelector options={SORT_OPTIONS} selected={sortBy} onSelect={setSortBy} />

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => onOpenTask(item.id)} onToggleComplete={onToggleComplete} />
        )}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState emoji="📚" title="No tasks yet" message="Tap Add Task to create your first one." />
          ) : (
            <EmptyState emoji="🔍" title="No matching tasks" message="Try a different search or filter." />
          )
        }
      />
      <AppButton title="➕ Add Task" onPress={() => onNavigate('add')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.text, marginBottom: 10 },
});
