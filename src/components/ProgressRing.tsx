import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme';
import { fontFamilies } from '@/src/theme';
import { Text } from 'react-native';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = colors.primary[600],
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const clamped = Math.max(0, Math.min(1, progress));
  const clampedProgress = clamped;

  const segments = useMemo(() => {
    const total = 100;
    const filled = Math.round(clampedProgress * total);
    return Array.from({ length: total }, (_, i) => i < filled);
  }, [clampedProgress]);

  return (
    <View style={[{ width: size, height: size }, styles.container]}>
      {segments.map((isFilled, i) => {
        const angle = (i / segments.length) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = size / 2 + radius * Math.cos(rad);
        const y = size / 2 + radius * Math.sin(rad);
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                width: strokeWidth,
                height: strokeWidth,
                borderRadius: strokeWidth / 2,
                backgroundColor: isFilled ? color : colors.neutral[200],
                position: 'absolute',
                left: x - strokeWidth / 2,
                top: y - strokeWidth / 2,
              },
            ]}
          />
        );
      })}
      <View style={styles.center}>
        {label && (
          <Text style={[styles.label, { color }]}>{label}</Text>
        )}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  segment: {},
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 28, fontFamily: fontFamilies.bold },
  sublabel: { fontSize: 12, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
});
