import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UploadedFile } from '../../types';

interface UploadCardProps {
  onFileSelect: (file: UploadedFile) => void;
  uploadedFile: UploadedFile | null;
  onRemove: () => void;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const UploadCard: React.FC<UploadCardProps> = ({ onFileSelect, uploadedFile, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      // Validate type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Unsupported file type. Please upload PNG, JPG, or JPEG.');
        return;
      }
      // Validate size
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
        return;
      }

      setIsUploading(true);
      // Simulate upload progress
      for (let p = 0; p <= 100; p += 10) {
        setUploadProgress(p);
        await new Promise((r) => setTimeout(r, 60));
      }
      setIsUploading(false);
      setUploadProgress(0);

      // Read dimensions
      const preview = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        onFileSelect({
          file,
          preview,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          dimensions: `${img.naturalWidth} × ${img.naturalHeight}`,
        });
      };
      img.src = preview;
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  if (uploadedFile) {
    return (
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-slate-800">Image Ready for Analysis</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <RefreshCw size={12} />
              Replace
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileInput} />
            </label>
            <button
              onClick={onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col md:flex-row gap-5">
          {/* Preview */}
          <div className="flex-shrink-0 w-full md:w-56 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src={uploadedFile.preview}
              alt="Uploaded RBC smear"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Meta */}
          <div className="flex flex-col justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-500" />
                File Information
              </h4>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <dt className="text-slate-500">Filename</dt>
                <dd className="font-medium text-slate-800 truncate max-w-[180px]">{uploadedFile.name}</dd>
                <dt className="text-slate-500">File Size</dt>
                <dd className="font-medium text-slate-800">{uploadedFile.size}</dd>
                <dt className="text-slate-500">Dimensions</dt>
                <dd className="font-medium text-slate-800">{uploadedFile.dimensions || 'Loading...'}</dd>
                <dt className="text-slate-500">Format</dt>
                <dd className="font-medium text-slate-800 uppercase">
                  {uploadedFile.file.type.split('/')[1]}
                </dd>
              </dl>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 size={14} className="text-green-600" />
              <p className="text-xs text-green-700 font-medium">
                Image validated successfully. Ready for analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <Upload size={16} className="text-blue-500" />
          Upload RBC Blood Smear Image
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload a peripheral blood smear image to begin morphology analysis.
        </p>

        {/* Drop zone */}
        <label
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed
            cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'}
          `}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileInput}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-4 w-2/3">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-100"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-600">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors
                  ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}
              >
                <Upload size={24} className={isDragging ? 'text-blue-500' : 'text-slate-400'} />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-xs text-slate-500 mb-3">or click to browse files</p>
              <div className="flex items-center gap-2">
                {['PNG', 'JPG', 'JPEG'].map((fmt) => (
                  <span key={fmt} className="badge-blue">{fmt}</span>
                ))}
                <span className="text-xs text-slate-400">Max {MAX_SIZE_MB} MB</span>
              </div>
            </>
          )}
        </label>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
