import React from 'react';
import { Chip } from 'react-native-paper';

const riskColor = {
  GREEN: { background: '#D1FAE5', text: '#047857' },
  YELLOW: { background: '#FEF3C7', text: '#B45309' },
  RED: { background: '#FEE2E2', text: '#B91C1C' }
} as const;

export function RiskBadge({ risk }: { risk: 'GREEN' | 'YELLOW' | 'RED' }) {
  return <Chip style={{ backgroundColor: riskColor[risk].background }} textStyle={{ color: riskColor[risk].text, fontWeight: '700' }}>{risk}</Chip>;
}
