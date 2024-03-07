import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Colors from '../App/Shared/Colors';

export default function VoiceVideoScreen({ videoUrl }) {

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        // source={{
        //   uri: 'https://firebasestorage.googleapis.com/v0/b/writing-task-3df83.appspot.com/o/2024-02-20%2014-26-39.mp4?alt=media&token=eda2faa6-8494-4b5b-a43c-7b0ec3310d3a',
        // }}
        source={{
          uri: videoUrl,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
         color="black"
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  video: {
    alignSelf: 'center',
    width: 360,
    height: 300,
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily:'outfit',
    
  },
});
