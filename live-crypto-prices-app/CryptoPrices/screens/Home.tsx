import React, {useState, useEffect} from 'react';
import {Text, View, Pressable, FlatList, StyleSheet} from 'react-native';
import {Crypto} from '../models/crypto';
import {socket} from '../App';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const [cryptoList, setCryptoList] = useState();

  useEffect(() => {
    socket.on('crypto', data => {
      setCryptoList(data);
    });
  }, []);

  //open detail
  const openCryptoDetail = (id: string) => {
    navigation.navigate('Detail', {id: id});
  };

  const renderItem = ({item}: {item: Crypto}) => {
    return (
      <Pressable
        style={styles.crypto}
        key={item.id}
        onPress={() => openCryptoDetail(item.id)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{Math.round(item.price * 1000) / 1000}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cryptoList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

//stylesheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272d42',
    flex: 1,
  },
  crypto: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#fff',
    fontSize: 24,
  },

  price: {
    color: '#ffab00',
    fontSize: 28,
  },
});
