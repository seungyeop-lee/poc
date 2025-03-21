import { ChangeEvent, useRef } from 'react'

export interface VideoFileSelectorProps {
  onSelect: (video: File) => void
}

export default function VideoFileSelector(props: VideoFileSelectorProps) {
  const { onSelect } = props
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files
          if (files && files.length > 0) {
            const file = files[0]
            if (!file.type.startsWith('video/')) {
              alert('비디오 파일만 업로드 가능합니다.')
              return
            }
            onSelect(file)
          }
        }}
        className="file-input file-input-bordered w-full max-w-xs"
      />
    </div>
  )
}
