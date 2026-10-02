import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { colors } from './src/theme';
import { sampleTasks } from './src/data/sampleTasks';
import { MIN_HOURS_PER_DAY, MAX_HOURS_PER_DAY } from './src/data/constants';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import RecommendScreen from './src/screens/RecommendScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';

export default function App() {
  // screen: 'dashboard' | 'tasks' | 'add' | 'details' | 'recommend' | 'recovery'
  // No navigation library: this one state variable decides which screen is rendered.
  const [screen, setScreen] = useState('dashboard');
  const [previousScreen, setPreviousScreen] = useState('dashboard'); // where "Back" from details goes
  const [tasks, setTasks] = useState(sampleTasks);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const openTask = (id) => {
    setPreviousScreen(screen);
    setSelectedTaskId(id);
    setScreen('details');
  };

  const addTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setScreen('tasks');
  };

  const toggleComplete = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setScreen(previousScreen);
  };

  const changeHours = (change) => {
    setHoursPerDay((prev) => Math.min(MAX_HOURS_PER_DAY, Math.max(MIN_HOURS_PER_DAY, prev + change)));
  };

  const goHome = () => setScreen('dashboard');

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'dashboard' && (
        <DashboardScreen
          tasks={tasks}
          hoursPerDay={hoursPerDay}
          onChangeHours={changeHours}
          onNavigate={setScreen}
          onOpenTask={openTask}
        />
      )}
      {screen === 'tasks' && (
        <TasksScreen
          tasks={tasks}
          onBack={goHome}
          onNavigate={setScreen}
          onOpenTask={openTask}
          onToggleComplete={toggleComplete}
        />
      )}
      {screen === 'add' && <AddTaskScreen onBack={goHome} onAddTask={addTask} />}
      {screen === 'details' && selectedTask && (
        <TaskDetailsScreen
          task={selectedTask}
          onBack={() => setScreen(previousScreen)}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
        />
      )}
      {screen === 'recommend' && (
        <RecommendScreen tasks={tasks} hoursPerDay={hoursPerDay} onBack={goHome} onToggleComplete={toggleComplete} />
      )}
      {screen === 'recovery' && (
        <RecoveryScreen
          tasks={tasks}
          hoursPerDay={hoursPerDay}
          onBack={goHome}
          onOpenTask={openTask}
          onToggleComplete={toggleComplete}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
