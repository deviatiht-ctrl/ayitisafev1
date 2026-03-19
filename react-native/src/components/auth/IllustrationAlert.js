import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Rect, Circle, Path, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function IllustrationAlert({ width = 300, height = 220 }) {
  const arc1 = useRef(new Animated.Value(1)).current;
  const arc2 = useRef(new Animated.Value(1)).current;
  const arc3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulse = (val, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 0, duration: 800, delay, useNativeDriver: false }),
          Animated.timing(val, { toValue: 1, duration: 800, useNativeDriver: false }),
        ])
      );
    createPulse(arc1, 0).start();
    createPulse(arc2, 200).start();
    createPulse(arc3, 400).start();
  }, []);

  return (
    <Svg viewBox="0 0 340 240" width={width} height={height}>
      {/* Orange glow behind phone */}
      <Circle cx={170} cy={115} r={80} fill="rgba(249,115,22,0.08)" />

      {/* Phone outline */}
      <Rect x={110} y={20} width={120} height={190} rx={16} stroke="#1B2A4A" strokeWidth={3} fill="white" />

      {/* Screen area */}
      <Rect x={118} y={40} width={104} height={150} rx={4} fill="#F4F6F9" />

      {/* Alert card inside phone */}
      <Rect x={125} y={60} width={90} height={55} rx={8} fill="#FEF2F2" />
      <Circle cx={140} cy={78} r={8} fill="#EF4444" />
      {/* Text lines inside card */}
      <Rect x={153} y={73} width={50} height={4} rx={2} fill="#D1D5DB" />
      <Rect x={153} y={82} width={40} height={4} rx={2} fill="#D1D5DB" />
      <Rect x={130} y={100} width={75} height={4} rx={2} fill="#E5E7EB" />

      {/* Second card hint */}
      <Rect x={125} y={125} width={90} height={40} rx={8} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={1} />
      <Rect x={135} y={135} width={50} height={4} rx={2} fill="#E5E7EB" />
      <Rect x={135} y={145} width={35} height={4} rx={2} fill="#E5E7EB" />

      {/* Bell icon */}
      <Path
        d="M 165,18 C 165,14 168,10 170,10 C 172,10 175,14 175,18 L 178,28 C 178,30 176,32 174,32 L 166,32 C 164,32 162,30 162,28 Z"
        fill="#1B2A4A"
      />
      <Circle cx={170} cy={35} r={2.5} fill="#1B2A4A" />

      {/* Notification dot on bell */}
      <Circle cx={178} cy={12} r={5} fill="#F97316" />

      {/* Radiating arcs */}
      <G opacity={0.6}>
        <Path d="M 150,20 C 148,10 155,2 165,0" stroke="#F97316" strokeWidth={1.5} fill="none" opacity={0.8} />
        <Path d="M 145,25 C 142,12 152,-2 165,-5" stroke="#F97316" strokeWidth={1.2} fill="none" opacity={0.5} />
        <Path d="M 190,20 C 192,10 185,2 175,0" stroke="#F97316" strokeWidth={1.5} fill="none" opacity={0.8} />
        <Path d="M 195,25 C 198,12 188,-2 175,-5" stroke="#F97316" strokeWidth={1.2} fill="none" opacity={0.5} />
      </G>
    </Svg>
  );
}
