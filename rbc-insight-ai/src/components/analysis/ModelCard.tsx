import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';
import type { MorphologyClass } from '../../types';
import { MORPHOLOGY_CLASSES, MORPHOLOGY_COLORS } from '../../data/mockData';
import MorphologyBadge from '../shared/MorphologyBadge';

interface ModelCardProps {
  predictedClass: MorphologyClass;
}

const ModelCard: React.FC<ModelCardProps> = ({ predictedClass }) => {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Cpu size={15} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">EfficientNetV2 Classification</h3>
          <p className="text-xs text-slate-500">Transfer learning · 12 morphology classes</p>
        </div>
        <span className="ml-auto badge-blue">Completed</span>
      </div>

      <div className="p-5">
        {/* Model info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Architecture', value: 'EfficientNetV2' },
            { label: 'Task', value: 'Classification' },
            { label: 'Classes', value: '12' },
            { label: 'Status', value: 'Ready', highlight: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-xl border text-center ${
                item.highlight ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p
                className={`text-sm font-bold ${
                  item.highlight ? 'text-green-700' : 'text-slate-800'
                }`}
              >
                {item.highlight && <CheckCircle2 size={12} className="inline mr-1 mb-0.5" />}
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Architecture description */}
        <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-semibold">EfficientNetV2</span> is a state-of-the-art convolutional neural
            network trained with transfer learning on RBC morphology datasets. It uses progressive learning
            and compound scaling to achieve high accuracy with efficient resource usage, making it ideal for
            medical image classification tasks.
          </p>
        </div>

        {/* Morphology classes */}
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-3">12 Morphology Classes</p>
          <div className="flex flex-wrap gap-2">
            {MORPHOLOGY_CLASSES.map((cls) => (
              <div key={cls} className="relative">
                <MorphologyBadge
                  morphology={cls as MorphologyClass}
                  size="md"
                  className={cls === predictedClass ? 'ring-2 ring-offset-1' : ''}
                />
                {cls === predictedClass && (
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white flex items-center justify-center"
                    style={{ backgroundColor: MORPHOLOGY_COLORS[cls as MorphologyClass] }}
                  >
                    <CheckCircle2 size={8} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            <span className="font-semibold" style={{ color: MORPHOLOGY_COLORS[predictedClass] }}>
              {predictedClass}
            </span>{' '}
            is the predicted class (highlighted above).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
