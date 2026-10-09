import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AnalysisResult } from '../../types';
import { MORPHOLOGY_COLORS } from '../../data/mockData';

interface PredictionChartProps {
  topPredictions: AnalysisResult['topPredictions'];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ topPredictions }) => {
  const data = topPredictions.map((p) => ({
    name: p.class,
    confidence: p.confidence,
    fill: MORPHOLOGY_COLORS[p.class] || '#3b82f6',
  }));

  return (
    <div>
      <p className="text-sm font-semibold text-slate-800 mb-4">Top Prediction Probabilities</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
            width={90}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Confidence']}
            contentStyle={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="confidence" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MorphologyPieChartProps {
  distribution: AnalysisResult['morphologyDistribution'];
}

export const MorphologyPieChart: React.FC<MorphologyPieChartProps> = ({ distribution }) => {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800 mb-4">RBC Morphology Distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={distribution}
            cx="40%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {distribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Percentage']}
            contentStyle={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
