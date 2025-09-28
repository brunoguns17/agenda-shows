import React from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, Show } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Shows"> & {
  shows: Show[];
  setShows: React.Dispatch<React.SetStateAction<Show[]>>;
};

const openMaps = (address: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
  Linking.openURL(url);
};

export default function ShowsScreen({ navigation, shows, setShows }: Props) {
  const insets = useSafeAreaInsets();
  const BAR_HEIGHT = 60; // altura do container do botão

  const deleteShow = (index: number) => {
    const newShows = [...shows];
    newShows.splice(index, 1);
    setShows(newShows);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Lista rolável; dá espaço extra no final para não ficar escondida atrás do botão fixo */}
      <FlatList
        data={Array.isArray(shows) ? shows : []}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: BAR_HEIGHT + insets.bottom + 24, // cards rolam por baixo do container fixo
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditShow", { index })}
            activeOpacity={0.9}
          >
            <View style={styles.showCard}>
              {/* Banner */}
              {item.banner ? (
                <Image source={{ uri: item.banner }} style={styles.banner} />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <Text style={{ color: "#999" }}>Sem banner</Text>
                </View>
              )}

              {/* Informações */}
              <View style={styles.infoBox}>
                <Text style={styles.showTitle}>{item.titulo}</Text>
                <Text style={styles.showInfo}>
                  {item.data} • {item.hora}
                </Text>
                <Text style={styles.showInfo}>📍 {item.cidade}</Text>

                {/* Preview do mapa + endereço */}
                <TouchableOpacity onPress={() => openMaps(item.local)}>
                  <Image
                    source={require("../assets/map-placeholder.png")}
                    style={styles.mapPreview}
                  />
                  <Text style={styles.showLocation}>{item.local}</Text>
                </TouchableOpacity>
              </View>

              {/* Botão excluir */}
              <Button
                title="Excluir"
                color="#FF6347"
                onPress={() => deleteShow(index)}
              />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum show adicionado ainda.</Text>
        }
      />

      {/* Container fixo do botão - acima dos botões do sistema */}
      <View
        style={[
          styles.fixedBar,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // respeita área segura no iOS/Android gestual
            height: BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 10),
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.fixedButtonInner}>
          <Button
            title="Adicionar Show"
            onPress={() => navigation.navigate("AddShow")}
            color="#1E90FF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  showCard: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  banner: { width: "100%", height: 180 },
  bannerPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: { padding: 12 },
  showTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  showInfo: { fontSize: 14, color: "#555", marginBottom: 4 },
  showLocation: {
    fontSize: 14,
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  mapPreview: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },

  // Barra fixa no rodapé
  fixedBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // fica colado ao fundo, mas com padding pelo inset
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  fixedButtonInner: {
    // garante espaço e não encosta nas bordas do container
  },
});
