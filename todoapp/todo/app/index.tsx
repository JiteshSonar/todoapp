import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
const index = () => {
  const [title, setTitle] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");

  const [id, setId] = useState<string>("");
  const [todoList, setTodoList] = useState<String[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const Url = "http://192.168.1.18:3000/todos";

  const handlePostTodo = async () => {
    try {
      await axios.post(Url, { title: title });
      setTitle("");
      getTodos();
      console.log("ToDo added successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const getTodos = async () => {
    try {
      const res = await axios.get(Url);
      setTodoList(res.data);
    } catch (error) {}
  };

  const handleDeleteTodo = async (todo: any) => {
    try {
      await axios.delete(`${Url}/${todo._id}`);
      getTodos();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditTodo = async (id: any) => {
    try {
      await axios.put(`${Url}/${id}`, { title: newTitle });
      getTodos();
      setNewTitle("");
      console.log("edit success");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="add todo.."
        style={styles.input}
        onChangeText={(text) => setTitle(text)}
        value={title}
      />
      <Button onPress={handlePostTodo} title="ADD TODO" />
      <View style={styles.todoListContainer}>
        {todoList &&
          todoList.map((todo: any, index) => (
            <View key={index} style={styles.titleCard}>
              <Text style={styles.titleText}>
                <Text style={{ fontWeight: 800 }}>Title:</Text> {todo.title}
              </Text>
              <View style={styles.btnCard}>
                <Text
                  style={styles.txtBtn}
                  onPress={() => {
                    setModalVisible(true);
                    setId(todo._id);
                    console.log(todo._id);
                  }}
                >
                  EDIT
                </Text>
                <Text
                  style={styles.txtBtn}
                  onPress={() => handleDeleteTodo(todo)}
                >
                  DELETE
                </Text>
              </View>
            </View>
          ))}
      </View>
      <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit title..</Text>
                <TextInput
                  placeholder="add todo.."
                  style={styles.input}
                  onChangeText={(text) => setNewTitle(text)}
                  value={newTitle}
                />
                <Text
                  onPress={() => {
                    handleEditTodo(id);
                    getTodos();
                    console.log(id);
                    setModalVisible(!modalVisible);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: "#16404D",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  todoListContainer: {
    backgroundColor: "#A6CDC6",
    padding: 9,
    borderRadius: 9,
  },
  titleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#16404D",
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  titleText: {
    color: "#FBF5DD",
    lineHeight: 20,
    fontSize: 14,
  },
  btnCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  txtBtn: {
    fontSize: 13,
    color: "#DDA853",
    paddingBlockEnd: 5,
    paddingStart: 10,
    fontWeight: 700,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
});
