import React, { useRef } from 'react';

interface MultiFileInputProps {
  label: string;
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

const MultiFileInput: React.FC<MultiFileInputProps> = ({
  label,
  files,
  setFiles,
  maxFiles = 6,
  accept = "image/*"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    setFiles(newFiles);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const canAddMore = files.length < maxFiles;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="space-y-2">
        {canAddMore && (
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
            >
              Add Photos
            </button>
            <span className="text-xs text-gray-500">
              {files.length}/{maxFiles} files selected
            </span>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/50 p-2 rounded">
                <span className="text-sm text-gray-400 truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-300 text-sm ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiFileInput;