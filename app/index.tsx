import { StyleSheet, View } from "react-native";

import { Chip, Text, TextInput, Button } from "react-native-paper";
import useGameStore, { Categories } from "@/components/Game/gameStore";
import { isNumeric } from "@/utils/numberUtils";
import { useRouter } from "expo-router";
import { toTitleCase } from "@/utils/stringUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  const setRoundDuration = useGameStore((state) => state.setRoundDuration);
  const setCategory = useGameStore((state) => state.setCategory);
  const roundDurationInSeconds = useGameStore(
    (state) => state.roundOption.roundDurationInSeconds
  );
  const category = useGameStore((state) => state.roundOption.category);

  const handleGoToGame = () => {
    router.push("/game");
  };

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={{ marginVertical: 24 }}>
            <Text style={styles.title}>WORD</Text>
            <Text style={styles.title}>GAME</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Round Time</Text>
              <TextInput
                style={styles.inputText}
                mode="outlined"
                textColor={Colors.dark.intent.default}
                outlineColor={Colors.dark.intent.default}
                activeOutlineColor={Colors.dark.intent.primary}
                defaultValue={roundDurationInSeconds.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setRoundDuration(
                    isNumeric(text) ? parseInt(text) : roundDurationInSeconds
                  );
                }}
              />
            </View>
          </View>
          <View style={[styles.inputContainer, { marginVertical: 24 }]}>
            <Text
              style={[
                styles.inputLabel,
                { textAlign: "center", width: "auto" },
              ]}
            >
              Select a Category
            </Text>
            <View style={styles.categoriesContainer}>
              {Categories.map((c) => (
                <Chip
                  key={c}
                  rippleColor={Colors.dark.bg.primary}
                  selectedColor={Colors.dark.intent.default}
                  onPress={() => setCategory(c)}
                  style={styles.category}
                  textStyle={{
                    color: Colors.dark.intent.default,
                    fontSize: 18,
                    padding: 8,
                    fontFamily: "Roboto_400Regular",
                  }}
                  selected={category === c}
                >
                  {toTitleCase(c)}
                </Chip>
              ))}
            </View>
          </View>
          <Button
            style={styles.button}
            onPress={handleGoToGame}
            disabled={category == null || roundDurationInSeconds == null}
          >
            <Text style={styles.buttonText}>START</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.dark.bg.secondary.default,
    height: "100%",
  },
  categoriesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  container: {
    margin: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inputContainer: {
    gap: 8,
  },
  inputText: {
    backgroundColor: Colors.dark.bg.secondary.default,
    fontSize: 18,
    textAlign: "center",
  },
  inputLabel: {
    color: Colors.dark.intent.default,
    fontSize: 24,
    fontWeight: "bold",
    width: 120,
  },
  category: {
    backgroundColor: Colors.dark.bg.secondary.default,
    borderColor: Colors.dark.intent.default,
    borderWidth: 1,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 88,
    lineHeight: 88,
    fontWeight: "bold",
    color: Colors.dark.intent.primary,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.dark.bg.primary,
    width: "100%",
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.dark.bg.secondary.default,
    letterSpacing: 2,
  },
});
