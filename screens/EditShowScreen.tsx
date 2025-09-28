import React, { useState } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaskInput, { Masks } from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList, Show } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "EditShow"> & {
  shows: Show[];
  setShows: React.Dispatch<React.SetStateAction<Show[]>>;
};

export default function EditShowScreen({
  navigation,
  route,
  shows,
  setShows,
}: Props) {
  const { index } = route.params;
  const [titulo, setTitulo] = useState(shows[index]?.titulo || "");
  const [data, setData] = useState(shows[index]?.data || "");
  const [hora, setHora] = useState(shows[index]?.hora || "");
  const [cidade, setCidade] = useState(shows[index]?.cidade || "");
  const [local, setLocal] = useState(shows[index]?.local || "");
  const [banner, setBanner] = useState(shows[index]?.banner || "");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBanner(result.assets[0].uri);
    }
  };

  const saveShow = () => {
    if (!titulo || !data || !hora || !cidade || !local || !banner) return;
    const newShows = [...shows];
    newShows[index] = { titulo, data, hora, cidade, local, banner };
    setShows(newShows);
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={60}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={styles.bannerPicker} onPress={pickImage}>
        {banner ? (
          <Image source={{ uri: banner }} style={styles.bannerPreview} />
        ) : (
          <Text style={{ color: "#666" }}>📷 Selecionar Banner</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <MaskInput
        value={data}
        onChangeText={(masked) => setData(masked)}
        mask={Masks.DATE_DDMMYYYY}
        placeholder="Data (DD/MM/AAAA)"
        style={styles.input}
        keyboardType="numeric"
      />
      <MaskInput
        value={hora}
        onChangeText={(masked) => setHora(masked)}
        mask={[/\d/, /\d/, ":", /\d/, /\d/]}
        placeholder="Hora (HH:MM)"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
        style={styles.input}
      />
      <TextInput
        placeholder="Endereço completo"
        value={local}
        onChangeText={setLocal}
        style={styles.input}
      />

      <Button title="Salvar Alterações" onPress={saveShow} color="#1E90FF" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  bannerPicker: {
    height: 180,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
