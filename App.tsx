import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShowsScreen from "./screens/ShowsScreen";
import AddShowScreen from "./screens/AddShowScreen";
import EditShowScreen from "./screens/EditShowScreen";

export type Show = {
  titulo: string;
  data: string;
  hora: string;
  cidade: string;
  local: string;
  banner: string; // novo campo para imagem
};

export type RootStackParamList = {
  Shows: undefined;
  AddShow: undefined;
  EditShow: { index: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [shows, setShows] = useState<Show[]>([]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1E1E1E" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#F5F5F5" },
        }}
      >
        <Stack.Screen name="Shows">
          {(props) => <ShowsScreen {...props} shows={shows} setShows={setShows} />}
        </Stack.Screen>
        <Stack.Screen name="AddShow">
          {(props) => <AddShowScreen {...props} shows={shows} setShows={setShows} />}
        </Stack.Screen>
        <Stack.Screen name="EditShow">
          {(props) => <EditShowScreen {...props} shows={shows} setShows={setShows} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
