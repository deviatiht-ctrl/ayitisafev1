import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export default function IllustrationShield({ width = 300, height = 240 }) {
  return (
    <Svg viewBox="0 0 340 260" width={width} height={height}>
      {/* Large shield */}
      <Path
        d="M 170,30 L 260,70 L 260,150 C 260,200 170,230 170,230 C 170,230 80,200 80,150 L 80,70 Z"
        fill="rgba(249,115,22,0.15)"
        stroke="#F97316"
        strokeWidth={3}
      />

      {/* 3 person icons inside shield top area */}
      <G>
        {/* Person 1 */}
        <Circle cx={145} cy={95} r={8} fill="white" opacity={0.9} />
        <Rect x={139} y={107} width={12} height={16} rx={4} fill="white" opacity={0.9} />
        {/* Person 2 (center, slightly bigger) */}
        <Circle cx={170} cy={90} r={9} fill="white" opacity={0.95} />
        <Rect x={163} y={103} width={14} height={18} rx={4} fill="white" opacity={0.95} />
        {/* Person 3 */}
        <Circle cx={195} cy={95} r={8} fill="white" opacity={0.9} />
        <Rect x={189} y={107} width={12} height={16} rx={4} fill="white" opacity={0.9} />
      </G>

      {/* Checkmark inside shield */}
      <Path
        d="M 130,160 L 155,185 L 210,130"
        stroke="#F97316"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Sparkles around shield */}
      {/* Top-right sparkle */}
      <Path d="M 275,50 L 278,42 L 281,50 L 289,53 L 281,56 L 278,64 L 275,56 L 267,53 Z" fill="#F97316" opacity={0.7} />
      {/* Top-left sparkle */}
      <Path d="M 65,55 L 68,47 L 71,55 L 79,58 L 71,61 L 68,69 L 65,61 L 57,58 Z" fill="#F97316" opacity={0.5} />
      {/* Bottom-right sparkle */}
      <Path d="M 280,170 L 282,165 L 284,170 L 289,172 L 284,174 L 282,179 L 280,174 L 275,172 Z" fill="#F97316" opacity={0.6} />
      {/* Bottom-left sparkle */}
      <Path d="M 60,165 L 62,160 L 64,165 L 69,167 L 64,169 L 62,174 L 60,169 L 55,167 Z" fill="#F97316" opacity={0.4} />
    </Svg>
  );
}
