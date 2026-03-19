import React from 'react';
import Svg, { Path, Circle, Line, G, Rect } from 'react-native-svg';

export default function IllustrationMap({ width = 300, height = 200 }) {
  return (
    <Svg viewBox="0 0 340 200" width={width} height={height}>
      {/* Background grid */}
      <G opacity={0.4}>
        {[40, 80, 120, 160].map((y) => (
          <Line key={`h${y}`} x1={0} y1={y} x2={340} y2={y} stroke="#E2E8F0" strokeWidth={0.5} />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <Line key={`v${x}`} x1={x} y1={0} x2={x} y2={200} stroke="#E2E8F0" strokeWidth={0.5} />
        ))}
      </G>

      {/* Haiti island silhouette */}
      <Path
        d="M 50,100 C 60,60 120,40 180,50 C 220,55 260,45 290,60 C 310,70 300,100 280,110 C 250,125 200,130 160,120 C 120,115 70,130 50,100 Z"
        fill="#E2E8F0"
        stroke="#CBD5E1"
        strokeWidth={1.5}
      />

      {/* Red zone - Cité Soleil */}
      <Circle cx={120} cy={85} r={18} fill="rgba(239,68,68,0.7)" />
      {/* Green zone - Pétion-Ville */}
      <Circle cx={190} cy={90} r={16} fill="rgba(34,197,94,0.7)" />
      {/* Orange zone - Delmas */}
      <Circle cx={155} cy={80} r={14} fill="rgba(245,158,11,0.7)" />

      {/* Dotted route line */}
      <Line
        x1={155} y1={80} x2={190} y2={90}
        stroke="#F97316"
        strokeDasharray="4,3"
        strokeWidth={2}
      />

      {/* Shield pins */}
      <G>
        {/* Pin at Cité Soleil */}
        <Path d="M 120,78 L 126,82 L 126,90 C 126,93 120,96 120,96 C 120,96 114,93 114,90 L 114,82 Z" fill="#1B2A4A" />
        <Circle cx={120} cy={85} r={2} fill="#F97316" />

        {/* Pin at Pétion-Ville */}
        <Path d="M 190,83 L 196,87 L 196,95 C 196,98 190,101 190,101 C 190,101 184,98 184,95 L 184,87 Z" fill="#1B2A4A" />
        <Circle cx={190} cy={90} r={2} fill="#F97316" />

        {/* Pin at Delmas */}
        <Path d="M 155,73 L 161,77 L 161,85 C 161,88 155,91 155,91 C 155,91 149,88 149,85 L 149,77 Z" fill="#1B2A4A" />
        <Circle cx={155} cy={80} r={2} fill="#F97316" />
      </G>
    </Svg>
  );
}
