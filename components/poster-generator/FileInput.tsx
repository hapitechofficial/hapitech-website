import React, { useRef } from 'react';

interface FileInputProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, file, setFile, accept = "image/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
        >
          Choose File
        </button>
        {file && (
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-sm text-gray-400 truncate">{file.name}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;