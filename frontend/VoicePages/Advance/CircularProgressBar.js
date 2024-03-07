import React from 'react';
import { View, Text } from 'react-native';
import { ProgressCircle } from 'react-native-svg';

export default function CircularProgressBar({ percentage }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <ProgressCircle
        style={{ height: 200 }}
        progress={percentage}
        progressColor={'rgb(134, 65, 244)'}
        strokeWidth={20}
      />
      <Text style={{ fontSize: 24, textAlign: 'center', marginTop: -100 }}>
        {`${(percentage * 100).toFixed(2)}%`}
      </Text>
    </View>
  );
}
