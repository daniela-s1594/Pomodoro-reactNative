import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Header from "./source/components/Header";
import Timer from "./source/components/Timer";

const colors = ["#EAC4FF", "#C4FFCC", "#F6FFC4"];

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    //run timer
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      //clear interval
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setIsWorking(prev => !prev);
      setTime(isWorking ? 300 : 15000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/tic-tac.mp3")
    );
    await sound.playAsync();
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[currentTime] }]}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: Platform.OS === "android" && 30,
        }}
      >
        <Text style={styles.text}>Pomodoro</Text>
        <Header
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setTime={setTime}
        />
        <Timer time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isActive ? "Stop" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 15,
    margin: 15,
    borderRadius: 15,
  },
});
