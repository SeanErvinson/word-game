import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Avatar, Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ScoreBox = {
  score?: number;
  color: string;
};

const colorMap = [
  "#0099da",
  "#f37027",
  "#fff",
  "#016fa5",
  "#ffcb04",
  "#ed1c24",
  "#008752",
];

const Lobby = () => {
  const [scoreBoxes, setScoreBoxes] = useState<Record<string, ScoreBox[]>>({
    one: Array.from(Array(colorMap.length).keys()).map<ScoreBox>((c) => ({
      color: colorMap[c],
    })),
    two: Array.from(Array(colorMap.length).keys()).map<ScoreBox>((c) => ({
      color: colorMap[c],
    })),
  });

  const router = useRouter();

  return (
    <SafeAreaView>
      <View>
        <View style={{ gap: 8 }}>
          {Object.entries(scoreBoxes).map(([key, value], index) => (
            <View key={`${key}-${index}`} style={styles.scoreBoxContainer}>
              {value.map((v, i) => (
                <View
                  key={i}
                  style={[styles.box, { backgroundColor: v.color }]}
                ></View>
              ))}
            </View>
          ))}
        </View>

        <Button
          onPress={() => {
            router.replace("/game");
          }}
        >
          Hello
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Lobby;

const styles = StyleSheet.create({
  scoreBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  box: {
    padding: 8,
    width: 48,
    height: 48,
  },
});
