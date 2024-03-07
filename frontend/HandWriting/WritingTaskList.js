import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { getWritingList } from '../App/Services';
import { useNavigation } from "@react-navigation/native";
import SubHeading from '../App/HomeScreens/SubHeading';
import { Audio } from 'expo-av';

export default function WritingTaskList() {
    const [writingList, setWritingList] = useState([]);
    const [playingSound, setPlayingSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigation = useNavigation();

    const playSound = async (item) => {
        try {
            if (playingSound && isPlaying) {
                await playingSound.stopAsync();
                console.log("Stopped!!!");
                setIsPlaying(false);
            } else {
                if (item.voice.url) {
                    const { sound } = await Audio.Sound.createAsync({ uri: item.voice.url });
                    await sound.playAsync();
                    console.log("Started!!!");
                    setPlayingSound(sound);
                    setIsPlaying(true);
                } else {
                    console.warn('No valid URI found for audio playback');
                }
            }
        } catch (error) {
            console.error('Error playing sound:', error.message);
        }
    };

    useEffect(() => {
        getWritingTaskList();
    }, []);

    const getWritingTaskList = () => {
        getWritingList().then((res) => {
            console.log("RESPONSE:--- ", res);
            setWritingList(res?.writingTasks);
        });
    };

    return (
        <View style={{paddingTop:20, margin:10}}>
            {/* <SubHeading text={'Basic Writing Tasks'} /> */}
            <FlatList
                data={writingList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => playSound(item)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', marginBottom: 15, borderRadius: 15}}>
                            <Image source={require('../assets/play.jpeg')} style={{ height: 60, width: 60, borderRadius: 15 }} />
                            <Text style={{ marginLeft: 10 }}>CAT</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
        </View>
    );
}
