import React, { useState } from 'react';
import { Text, Button, View, FlatList, StyleSheet, Modal, Image, TouchableHighlight, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Value } from 'react-native-reanimated';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}




function PokemonScreen(){
 const [elementos,guardarlista] = useState([]);
  fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         const listado=responseJson.results;
         guardarlista(listado);
      })
      .catch((error) => {
         console.error(error);
      });



  const [ModalVisible, setModalVisible] = useState(false);
  const [PokeSprite, setPokeSprite] = useState('');
  const [PokeDatos, setPokeDatos] = useState([]);
  const [PokeTipos, setPokeTipos] = useState([]);



  function PokeSelect(PokeSeleccionado){
      const direccion = (elementos.find((value) => value.name === PokeSeleccionado)).url
      
         fetch(direccion, {
          method: 'GET'
          
       })
       .then((response2) => response2.json())
       .then((responseJson2) => {
          const listado2=responseJson2;
          setPokeDatos(listado2);
          setPokeSprite(listado2.sprites.front_default)
          setPokeTipos(listado2.types)
       })
       .catch((error) => {
          console.error(error);
       });

       setModalVisible(true)
  }

  function MostrarPokemon(){
    
      return(
        <View>
          <Image 
            source={{uri: PokeSprite}}
            style={{width:400, height:400}}></Image>
          <Text style={styles.datosPokemon}>{'Pokemon: ' + PokeDatos.name + '\n'}</Text>
          <Text style={styles.datosPokemon}>{'Peso: ' + PokeDatos.weight}</Text>
          <Text style={styles.datosPokemon}>{'Altura: ' + PokeDatos.height}</Text>
          <Text style={styles.datosPokemon}>{'Tipo: '}
          <FlatList
                data={PokeTipos}
                renderItem={({item})=> <Text style={styles.datosPokemon}>{'- ' + item.type.name}</Text>}
              /></Text>
        </View>
      );
  }

  return(
    <>
     <View style={{flex:1}} >
       <Text style={{fontSize:18,textAlign:'center',height:40,marginTop:10,backgroundColor:'lightgray',textAlignVertical:'center', borderRadius:10,marginLeft:10,marginRight:10}}> Pokemones</Text>
              <FlatList
                data={elementos}
                renderItem={({item})=>
                <TouchableHighlight onPress={() => PokeSelect(item.name)}>
                  <Text style={styles.item}>{item.name}</Text>
                </TouchableHighlight>
                }
              />
     </View>
     <Modal
          visible= {ModalVisible}>
          <View style={styles.ViewModalSup}>
            <View style={styles.ViewModalInf}>

              <View style={styles.Encabezado}>
                <TouchableHighlight onPress={() => setModalVisible(false)}>
                  <Image
                    source={require('./assets/flecha.png')}
                    style={styles.flechaAtras}
                  />
                </TouchableHighlight>
              </View>

              <View>{MostrarPokemon()}</View>
            </View>
          </View>
        </Modal>
    </>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Lista" component={PokemonScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
ViewModalSup:
{   width: '100%',
    height: '100%',
    flex:1,
    backgroundColor: 'rgba(1,1,1,0.8)',
    justifyContent: 'center',
    alignItems:'center',
},
ViewModalInf:
{
    height:'90%',
    width:'90%',
    backgroundColor: '#fff',
},
Encabezado:
{
  height: 80,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
},
flechaAtras:
{
  width: 50,
  height: 50,
  margin: 10,
},
datosPokemon:
{
  textAlign: 'center',
  fontSize: 25,
  fontStyle: 'italic'
}
});
