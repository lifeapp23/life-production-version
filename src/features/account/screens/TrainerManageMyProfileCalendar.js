import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';


export const PlansCalendarScreen = ({ isVisible, onClose, onSelectDateRange }) => {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDayPress = (day) => {
    const { dateString } = day;
    setSelectedDates((prev) => ({
      ...prev,
      [dateString]: {
        ...prev[dateString],
        selected: !prev[dateString]?.selected,
        selectedColor: '#3f7eb3',
        selectedTextColor: 'white',
      },
    }));
  };

  const handleDonePress = () => {
    const selected = Object.keys(selectedDates).filter((date) => selectedDates[date].selected);
    if (selected.length >= 2) {
      const startDate = selected[0];
      const endDate = selected[selected.length - 1];
      onSelectDateRange(startDate, endDate);
    }

    // Reset selectedDates
    setSelectedDates({});
    onClose();
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            markingType={'period'}
            markedDates={selectedDates}
            onDayPress={handleDayPress}
            maxDate={'2100-12-31'}
          />
          <TouchableOpacity style={styles.doneButton} onPress={handleDonePress}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: 300,
    alignSelf: 'center',
  },
  doneButton: {
    backgroundColor: '#3f7eb3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  doneText: {
    color: 'white',
    textAlign: 'center',
  },
});
