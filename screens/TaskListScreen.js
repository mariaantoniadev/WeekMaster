import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskListScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null); // Para controlar a edição

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const storedTasks = await AsyncStorage.getItem(`tasks_${userToken}`);
          if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar tarefas', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (task) {
      const newTask = {
        id: Math.random().toString(),
        task,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');

      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          await AsyncStorage.setItem(`tasks_${userToken}`, JSON.stringify(updatedTasks));
        }
      } catch (error) {
        console.error('Erro ao salvar tarefa', error);
      }
    } else {
      Alert.alert('Por favor, insira uma tarefa.');
    }
  };

  const handleToggleTask = async (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        await AsyncStorage.setItem(`tasks_${userToken}`, JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    }
  };

  const handleDeleteTask = async (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        await AsyncStorage.setItem(`tasks_${userToken}`, JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa', error);
    }
  };

  const handleEditTask = async (id) => {
    const taskToEdit = tasks.find(t => t.id === id);
    setEditingTask(taskToEdit);
    setTask(taskToEdit.task); // Preenche o campo de edição com a tarefa atual
  };

  const handleUpdateTask = async () => {
    if (task && editingTask) {
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...t, task } : t);
      setTasks(updatedTasks);
      setEditingTask(null);
      setTask('');

      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          await AsyncStorage.setItem(`tasks_${userToken}`, JSON.stringify(updatedTasks));
        }
      } catch (error) {
        console.error('Erro ao atualizar tarefa', error);
      }
    } else {
      Alert.alert('Por favor, insira uma tarefa para editar.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao fazer logout', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar sair.');
    }
  };

  const filteredTasks = tasks.filter(t => {
    return filter ? t.task.toLowerCase().includes(filter.toLowerCase()) : true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.navbarText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navbarText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>My Todo-s</Text>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={editingTask ? handleUpdateTask : handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>{editingTask ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSortContainer}>
        <Text style={styles.filterText}>Search</Text>
        <TextInput
          style={styles.filterInput}
          value={filter}
          onChangeText={setFilter}
          placeholder="Search tasks..."
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)} style={styles.checkbox}>
              <Text style={styles.checkboxText}>{item.completed ? '✔' : '◯'}</Text>
            </TouchableOpacity>
            <Text style={item.completed ? styles.completedTask : styles.task}>{item.task}</Text>
            <TouchableOpacity onPress={() => handleEditTask(item.id)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navbarText: {
    fontSize: 16,
    color: '#0A4166',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#0A4166',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
  },
  filterSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  filterInput: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 20,
  },
  task: {
    flex: 1,
    fontSize: 16,
  },
  completedTask: {
    flex: 1,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default TaskListScreen;
