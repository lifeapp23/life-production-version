import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider, StyleSheet } from 'react-native-paper';

export const TaskDetailsPopup = ({ visible, onClose, taskDetails }) => {

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <View style={styles.modalContainer}>
            <Text style={styles.taskTitle}>{taskDetails.title}</Text>
            <Text>{taskDetails.description}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
        </Modal>
      </Portal>
      <Button style={{marginTop: 30}} onPress={showModal}>
        Show
      </Button>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
