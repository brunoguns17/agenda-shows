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

// Função auxiliar para determinar turno (Dia/Noite com ícone)
const getTurno = (hora: string) => {
  if (!hora) return "";
  const cleanHora = hora.trim();
  if (!cleanHora.includes(":")) return "";
  const [hStr] = cleanHora.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return "";
  return h >= 6 && h < 18 ? "☀️ Dia" : "🌙 Noite";
};

// Função para verificar status do evento
const getStatus = (data: string) => {
  if (!data) return "finalizado";

  const [dia, mes, ano] = data.split("/").map(Number);
  const dataEvento = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  return dataEvento >= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    ? "ativo"
    : "finalizado";
};

export default function ShowsScreen({ navigation, shows, setShows }: Props) {
  const insets = useSafeAreaInsets();
  const BAR_HEIGHT = 60;

  const deleteShow = (index: number) => {
    const newShows = [...shows];
    newShows.splice(index, 1);
    setShows(newShows);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={Array.isArray(shows) ? shows : []}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: BAR_HEIGHT + insets.bottom + 24,
        }}
        renderItem={({ item, index }) => {
          const status = getStatus(item.data);

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("EditShow", { index })}
              activeOpacity={0.9}
            >
              <View style={styles.showCard}>
                {item.banner ? (
                  <Image source={{ uri: item.banner }} style={styles.banner} />
                ) : (
                  <View style={styles.bannerPlaceholder}>
                    <Text style={{ color: "#999" }}>Sem banner</Text>
                  </View>
                )}

                <View style={styles.infoBox}>
                  <Text style={styles.showTitle}>{item.titulo}</Text>

                  {/* Hora + turno */}
                  <View style={styles.timeRow}>
                    <Text style={styles.showInfo}>
                      {item.data} • {item.hora}
                    </Text>
                    {getTurno(item.hora) !== "" && (
                      <Text style={styles.turnoText}>
                        {"  "}
                        {getTurno(item.hora)}
                      </Text>
                    )}
                  </View>

                  {/* Status logo abaixo da hora/turno */}
                  <View
                    style={[
                      styles.statusBox,
                      status === "ativo" ? styles.statusAtivo : styles.statusFinalizado,
                    ]}
                  >
                    <Text
                      style={{
                        color: status === "ativo" ? "#0A730A" : "#B00020",
                        fontWeight: "bold",
                      }}
                    >
                      {status === "ativo" ? "Ativo" : "Finalizado"}
                    </Text>
                  </View>

                  <Text style={styles.showInfo}>📍 {item.cidade}</Text>

                  <TouchableOpacity onPress={() => openMaps(item.local)}>
                    <Image
                      source={require("../assets/map-placeholder.png")}
                      style={styles.mapPreview}
                    />
                    <Text style={styles.showLocation}>{item.local}</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Excluir"
                  color="#FF6347"
                  onPress={() => deleteShow(index)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum show adicionado ainda.</Text>
        }
      />

      <View
        style={[
          styles.fixedBar,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
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
  showInfo: { fontSize: 14, color: "#555" },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  turnoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },

  // Status
  statusBox: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10, // espaço extra
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusAtivo: {
    backgroundColor: "rgba(144, 238, 144, 1)", // verde claro translúcido
  },
  statusFinalizado: {
    backgroundColor: "rgba(255, 182, 193, 1)", // vermelho claro translúcido
  },

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
  fixedBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
  fixedButtonInner: {},
});
