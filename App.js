import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const OPENROUTE_API_KEY = ""; // 🔑 Insira sua API Key do OpenRouteService

export default function App() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(""); // Endereço digitado
  const [destinationCoords, setDestinationCoords] = useState(null); // Coordenadas do destino
  const [coords, setCoords] = useState([]); // Caminho percorrido
  const [route, setRoute] = useState([]); // Rota fixa até o destino

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setCoords([currentLocation.coords]); // Inicia o tracking

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (newLocation) => {
          setLocation(newLocation.coords);
          setCoords((prevCoords) => [...prevCoords, newLocation.coords]); // Adiciona ao trajeto
        }
      );
    })();
  }, []);

  


  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marcador do usuário */}
          <Marker coordinate={location} title="Você está aqui" />

          {/* Caminho percorrido */}
          <Polyline coordinates={coords} strokeWidth={4} strokeColor="blue" />
        </MapView>
      ) : (
        <Text style={styles.text}>Carregando localização...</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  text: { fontSize: 18, textAlign: "center", marginTop: 20 },
});

