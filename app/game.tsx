import useGameStore from "@/components/Game/gameStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Button, Modal, Portal, Text } from "react-native-paper";

import { shuffle } from "@/utils/arrayUtils";
import { fetchGameWords } from "@/modules/game/queries/useGameWords";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const router = useRouter();
  const roundDurationInSeconds = useGameStore(
    (state) => state.roundOption.roundDurationInSeconds
  );
  const category = useGameStore((state) => state.roundOption.category);
  const [timer, setTimer] = useState(roundDurationInSeconds);
  const [correctGuessScore, setCorrectGuessScore] = useState(0);
  const [incorrectGuessScore, setIncorrectGuessScore] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const getGameWord = async () => {
      const response = await fetchGameWords();
      setWords(shuffle(response[category]));
    };
    getGameWord();
  }, []);

  const playableWords = !gameStarted ? [] : words;

  const handleOnStart = () => {
    setGameStarted(true);
  };

  const handleGoBack = () => {
    router.replace("/");
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (gameStarted) {
      timerId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setTimeoutId(timerId);
    }

    return () => {
      if (timerId && gameStarted) {
        clearTimeout(timerId);
      }
    };
  }, [gameStarted]);

  useEffect(() => {
    if (timer <= 0 && timeoutId) {
      setGameStarted(false);
      setGameFinished(true);
      clearTimeout(timeoutId);
    }
  }, [timer]);

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.scoreGroup}>
              <Text
                style={[styles.text, { color: Colors.dark.intent.negative }]}
              >
                ✕
              </Text>
              <Text style={[styles.text]}>{incorrectGuessScore}</Text>
            </View>
            <Text style={[styles.text, { fontSize: 48 }]}>
              {timer > 0 ? timer : ""}
            </Text>
            <View style={styles.scoreGroup}>
              <Text
                style={[styles.text, { color: Colors.dark.intent.positive }]}
              >
                ✔
              </Text>
              <Text style={[styles.text]}>{correctGuessScore}</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Swiper
              containerStyle={styles.cardOverlayContainer}
              cardStyle={styles.card}
              useViewOverflow={false}
              cards={playableWords}
              renderCard={(card) => {
                return <Text style={styles.cardText}>{card}</Text>;
              }}
              onSwipedRight={() => {
                setCorrectGuessScore((state) => state + 1);
              }}
              onSwipedLeft={() => {
                setIncorrectGuessScore((state) => state + 1);
              }}
              verticalSwipe={false}
              horizontalSwipe={gameStarted}
              backgroundColor={"#000"}
              showSecondCard={false}
            />
          </View>

          <View
            style={{
              height: 80,
              width: "100%",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {!gameStarted && !gameFinished && timer >= 0 && (
              <Button style={styles.button} onPress={handleOnStart}>
                <Text style={styles.buttonText}>START</Text>
              </Button>
            )}
          </View>
        </View>
        <Portal>
          <Modal
            contentContainerStyle={styles.modal}
            visible={gameFinished}
            onDismiss={handleGoBack}
            dismissable={false}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 48, color: Colors.dark.intent.default },
                ]}
              >
                TIME'S UP!
              </Text>
              <Button
                style={[
                  styles.button,
                  { width: "50%", paddingHorizontal: 0, paddingVertical: 4 },
                ]}
                onPress={handleGoBack}
              >
                <Text style={styles.buttonText}>GO BACK</Text>
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 40,
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    borderRadius: 8,
  },
  body: {
    backgroundColor: Colors.dark.bg.secondary.bold,
    height: "100%",
  },
  container: {
    flex: 1,
    marginHorizontal: 28,
    marginVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    position: "relative",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  cardOverlayContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: Colors.dark.bg.secondary.muted,
  },
  card: {
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 4,
    borderColor: Colors.dark.border.primary,
    backgroundColor: Colors.dark.bg.secondary.default,

    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  cardText: {
    fontSize: 56,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark.intent.default,
  },
  scoreGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  text: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.dark.bg.secondary.default,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.dark.bg.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.dark.bg.secondary.default,
    letterSpacing: 2,
  },
});
