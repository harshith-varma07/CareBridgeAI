import React from 'react';
import { Chip } from 'react-native-paper';

const riskColor = {
  GREEN: '#43A047',
  YELLOW: '#FDD835',
  RED: '#E53935'
} as const;

export function RiskBadge({ risk }: { risk: 'GREEN' | 'YELLOW' | 'RED' }) {
  return <Chip style={{ backgroundColor: riskColor[risk] }}>{risk}</Chip>;
}
