import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DataPoint = {
  value: number;
  date: Date;
  label?: string;
};

type BiomarkerChartProps = {
  title: string;
  data: DataPoint[];
  color?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  showDots?: boolean;
  height?: number;
  isCategorical?: boolean; // If true, show categorical labels instead of numbers
  customYLabels?: number[]; // Custom Y-axis values (e.g., predefined pH values)
  evenlySpaced?: boolean; // If true with customYLabels, space labels evenly regardless of numeric value
};

// Categorical Y-axis labels using actual biomarker symbols
const CATEGORICAL_LABELS: Record<number, string> = {
  1: '−',      // Negative
  2: '±',      // Borderline  
  3: '+',      // Positive
  4: '++',     // Strong (LE only)
  5: '+++',    // Very strong (LE only)
};

// Predefined pH values used in the app (exported for use in charts)
export const PH_VALUES = [3.8, 4.4, 4.6, 4.8, 5.4] as const;

export function BiomarkerChart({
  title,
  data,
  color = Colors.light.rush,
  unit = '',
  minValue,
  maxValue,
  showDots = true,
  height = 140,
  isCategorical = false,
  customYLabels,
  evenlySpaced = false,
}: BiomarkerChartProps) {
  if (data.length < 2) return null;

  const yAxisWidth = 35;
  const chartWidth = SCREEN_WIDTH - 80 - yAxisWidth;
  const chartHeight = height - 40;
  const paddingTop = 10;
  const paddingBottom = 30;
  const paddingLeft = 5;
  const paddingRight = 10;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // For evenly spaced custom labels, we map values to their index position
  const sortedCustomLabels = customYLabels ? [...customYLabels].sort((a, b) => a - b) : null;
  
  // For categorical, use exact values 1, 2, 3. For numeric, add padding.
  const yMin = isCategorical ? 1 : (minValue ?? Math.min(...data.map(d => d.value)));
  const yMax = isCategorical ? 3 : (maxValue ?? Math.max(...data.map(d => d.value)));
  const yRange = yMax - yMin || 1;

  // Helper to convert value to Y position
  const valueToY = (value: number) => {
    if (evenlySpaced && sortedCustomLabels && sortedCustomLabels.length > 1) {
      // Find the closest label index or interpolate between labels
      const labelCount = sortedCustomLabels.length;
      
      // Find where this value falls among the labels
      let lowerIdx = 0;
      let upperIdx = labelCount - 1;
      
      for (let i = 0; i < labelCount - 1; i++) {
        if (value >= sortedCustomLabels[i] && value <= sortedCustomLabels[i + 1]) {
          lowerIdx = i;
          upperIdx = i + 1;
          break;
        }
      }
      
      // Handle values outside the range
      if (value <= sortedCustomLabels[0]) {
        return paddingTop + graphHeight; // Bottom
      }
      if (value >= sortedCustomLabels[labelCount - 1]) {
        return paddingTop; // Top
      }
      
      // Interpolate position between the two nearest labels
      const lowerVal = sortedCustomLabels[lowerIdx];
      const upperVal = sortedCustomLabels[upperIdx];
      const ratio = (value - lowerVal) / (upperVal - lowerVal);
      
      const lowerY = paddingTop + graphHeight - (lowerIdx / (labelCount - 1)) * graphHeight;
      const upperY = paddingTop + graphHeight - (upperIdx / (labelCount - 1)) * graphHeight;
      
      return lowerY + (upperY - lowerY) * ratio;
    }
    
    return paddingTop + graphHeight - ((value - yMin) / yRange) * graphHeight;
  };

  // Calculate points
  const points = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * graphWidth,
    y: valueToY(d.value),
    value: d.value,
    date: d.date,
  }));

  // Create straight line path
  const createLinePath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  // Create filled area path
  const createAreaPath = () => {
    const linePath = createLinePath();
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${linePath} L ${lastPoint.x} ${paddingTop + graphHeight} L ${firstPoint.x} ${paddingTop + graphHeight} Z`;
  };

  const linePath = createLinePath();
  const areaPath = createAreaPath();

  // Y-axis labels - use valueToY for perfect alignment
  const yLabels = isCategorical
    ? [
        { value: 3, y: valueToY(3), label: CATEGORICAL_LABELS[3] },  // + (top)
        { value: 2, y: valueToY(2), label: CATEGORICAL_LABELS[2] },  // ± (middle)
        { value: 1, y: valueToY(1), label: CATEGORICAL_LABELS[1] },  // − (bottom)
      ]
    : (evenlySpaced && sortedCustomLabels)
      ? sortedCustomLabels.map((val, idx) => ({
          value: val,
          // Evenly space labels from bottom to top
          y: paddingTop + graphHeight - (idx / (sortedCustomLabels.length - 1)) * graphHeight,
          label: val.toFixed(1),
        })).reverse() // Reverse so highest value is at top
      : customYLabels
        ? customYLabels.map(val => ({
            value: val,
            y: valueToY(val),
            label: val.toFixed(1),
          }))
        : [
            { value: yMax, y: valueToY(yMax), label: yMax.toFixed(1) },
            { value: (yMax + yMin) / 2, y: valueToY((yMax + yMin) / 2), label: ((yMax + yMin) / 2).toFixed(1) },
            { value: yMin, y: valueToY(yMin), label: yMin.toFixed(1) },
          ];

  // Format date for x-axis
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      
      <View style={styles.chartRow}>
        {/* Y-axis labels - outside on the left */}
        <View style={[styles.yAxisLabels, { height: chartHeight }]}>
          {yLabels.map((yLabel, i) => (
            <Text
              key={`y-label-${i}`}
              style={[
                styles.yLabel,
                { top: yLabel.y - 7 },
                isCategorical && styles.yLabelCategorical,
              ]}
            >
              {yLabel.label}
            </Text>
          ))}
        </View>

        {/* Chart SVG */}
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          {/* Horizontal grid lines */}
          {yLabels.map((label, i) => (
            <Line
              key={`grid-${i}`}
              x1={paddingLeft}
              y1={label.y}
              x2={chartWidth - paddingRight}
              y2={label.y}
              stroke={Colors.light.rush}
              strokeOpacity={0.15}
              strokeWidth={1}
            />
          ))}

          {/* Filled area under curve */}
          <Path
            d={areaPath}
            fill={`url(#gradient-${title})`}
          />

          {/* Main curve line */}
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {showDots && points.map((point, i) => (
            <React.Fragment key={`point-${i}`}>
              <Circle
                cx={point.x}
                cy={point.y}
                r={5}
                fill="#FFFFFF"
                stroke={color}
                strokeWidth={2}
              />
            </React.Fragment>
          ))}
        </Svg>
      </View>

      {/* X-axis labels */}
      <View style={[styles.xAxisLabels, { width: graphWidth, marginLeft: yAxisWidth + paddingLeft }]}>
        {data.length <= 5 ? (
          // Show all labels if 5 or fewer points
          points.map((point, i) => (
            <Text
              key={`x-label-${i}`}
              style={[
                styles.xLabel,
                { left: point.x - paddingLeft - 15, width: 30 }
              ]}
            >
              {formatDate(point.date)}
            </Text>
          ))
        ) : (
          // Show first, middle, and last for more points
          <>
            <Text style={[styles.xLabel, { left: 0 }]}>
              {formatDate(points[0].date)}
            </Text>
            <Text style={[styles.xLabel, { left: graphWidth / 2 - 15 }]}>
              {formatDate(points[Math.floor(points.length / 2)].date)}
            </Text>
            <Text style={[styles.xLabel, { left: graphWidth - 30 }]}>
              {formatDate(points[points.length - 1].date)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// Helper function to convert categorical biomarker values to numeric
// Uses the actual symbols: -, ±, +, ++, +++
export function categoricalToNumeric(value: string | null): number {
  if (!value) return 0;
  
  // Normalize the value (handle different dash types)
  const normalized = value.replace('−', '-').trim();
  
  // Mapping based on actual biomarker symbols
  const mappings: Record<string, number> = {
    '-': 1,      // Negative/Normal
    '±': 2,      // Borderline
    '+': 3,      // Positive
    '++': 4,     // Strong positive (LE)
    '+++': 5,    // Very strong positive (LE)
  };

  return mappings[normalized] ?? 0;
}

// Get display label for categorical values (the actual symbols)
export function getCategoricalLabel(numericValue: number): string {
  const labels: Record<number, string> = {
    1: '−',
    2: '±',
    3: '+',
    4: '++',
    5: '+++',
  };
  return labels[numericValue] ?? '';
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  unit: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.7,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisLabels: {
    width: 35,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.rush,
    opacity: 0.7,
    width: 32,
    textAlign: 'right',
    right: 3,
  },
  yLabelCategorical: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  xAxisLabels: {
    position: 'relative',
    height: 20,
    marginTop: -5,
  },
  xLabel: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.6,
    textAlign: 'center',
  },
});
