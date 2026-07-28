import { useRef } from 'react'

interface FileUploadFieldProps {
  label: string
  value: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
  error?: string
}

/** Controlled file picker meant to be driven via react-hook-form's <Controller>. */
export function FileUploadField({
  label,
  value,
  onChange,
  multiple = false,
  accept,
  maxFiles,
  error,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePick = (fileList: FileList | null) => {
    if (!fileList) return
    const picked = Array.from(fileList)
    const next = multiple ? [...value, ...picked] : picked.slice(0, 1)
    onChange(maxFiles ? next.slice(0, maxFiles) : next)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handlePick(e.target.files)}
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1.5"
      />
      {value.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {value.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between">
              <span className="truncate text-gray-700">
                {file.name} ({Math.ceil(file.size / 1024)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="ml-2 text-xs text-red-600 hover:underline"
              >
                제거
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
