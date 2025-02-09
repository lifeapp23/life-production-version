import React, { useState } from 'react';
import { View, Text,Modal ,TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

export const RequestPasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const requestPasswordReset = debounce(async () => {
        // try {
        //     const response = await axios.post('https://life-pf.com/api/password/email', { email });
        //     Alert.alert(`${t('Success')}`, `${t(response?.data?.message)}`);
        //     navigation.navigate('Login');
        // } catch (error) {
        //     Alert.alert(` `, error?.response?.data?.errors?.email[0]);
        // }
        setLoading(true);

        axios.post('https://life-pf.com/api/password/email', { email })
                .then(response => {
                  // Handle successful response
                  //console.log('trainer::',response.data["trainers"]);
                  setLoading(false);
                  // Delay to allow users to see the success message before closing the modal
                  setTimeout(() => {

                  Alert.alert(`${t('Success')}`,
                    `${t(response?.data?.message)}`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          navigation.navigate('Login');
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }, 500); // 2 seconds delay

                  // Alert.alert(`${t('Success')}`, `${t(response?.data?.message)}`);
                  // navigation.navigate('Login');
                })
                .catch(error => {
                  // Handle error
                  //console.log('Error fetching Trainers:', error);
                  setLoading(false);

                  Alert.alert(` `, error?.response?.data?.errors?.email[0]);

                });
    }, 2000); // Debounce delay

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Request_Password_Reset')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("Email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={{height:50,width:"100%",backgroundColor:'#000',padding:10,paddingLeft:35,paddingRight:35,borderRadius:8,justifyContent:"center",alignItems:"center"}} onPress={requestPasswordReset} >
        <Text style={{
          color: '#FFF',
          textAlign: 'center',
        }}>{t('Send_Reset_Link')}</Text>
      </TouchableOpacity>
      <Modal
              animationType="slide"
              transparent={true}
              visible={loading} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loading && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  
                </View>
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width:"100%",
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  loadingBox: {
    width: 200,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 15,
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
});