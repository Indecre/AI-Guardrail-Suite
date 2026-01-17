"use client";

type FileUploadProps = {
  onSelect: (file: File) => void;
  accept?: string;
};

export default function FileUpload({ onSelect, accept }: FileUploadProps) {
  return (
    <div className="upload-box">
      <div>
        <strong>Drop a file</strong> or click to upload.
      </div>
      <input
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
        }}
      />
      <div className="note">Max size depends on your backend settings.</div>
    </div>
  );
}
