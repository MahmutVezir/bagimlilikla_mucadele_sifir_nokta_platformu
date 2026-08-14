import { StyleSheet, View } from 'react-native';
import { colors, fontFamilies, radius, spacing } from '@/src/theme';
import { Text } from 'react-native';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  maxValue?: number;
  color?: string;
  height?: number;
}

export function BarChart({ data, maxValue, color, height = 180 }: BarChartProps) {
  const max = maxValue ?? Math.max(10, ...data.map((d) => d.value));
  const barColor = color ?? colors.primary[500];

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((d, i) => {
          const barHeight = max > 0 ? (d.value / max) * height : 0;
          return (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(2, barHeight), backgroundColor: d.value > 0 ? barColor : colors.neutral[200] },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{d.label}</Text>
              {d.value > 0 && <Text style={styles.barValue}>{d.value}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xs },
  barColumn: { flex: 1, alignItems: 'center' },
  barTrack: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' },
  bar: { width: '70%', borderRadius: radius.sm, minHeight: 2 },
  barLabel: { fontSize: 10, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4 },
  barValue: { fontSize: 9, fontFamily: fontFamilies.semibold, color: colors.neutral[600], marginTop: 2 },
});
