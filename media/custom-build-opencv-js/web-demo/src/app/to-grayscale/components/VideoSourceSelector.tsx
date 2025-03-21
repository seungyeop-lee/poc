import VideoFileSelector from "@/app/to-grayscale/components/VideoFileSelector";
import {useEffect, useRef, useState} from "react";

export interface VideoSourceSelectorProps {
    onSelect: () => void
}

export default function VideoSourceSelector(props: VideoSourceSelectorProps) {
    const {onSelect} = props
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoSource, setVideoSource] = useState<'camera' | 'file'>('camera')
    const [videoFile, setVideoFile] = useState<File | null>(null)

    useEffect(() => {
        if (videoSource === 'camera') {

        }
        if (videoSource === 'file' && videoFile) {

        }
    }, [videoSource, videoFile]);

    return (
        <>
            <video
                ref={videoRef}
                width={0}
                height={0}
                className="invisible"
            />
            <button
                type="button"
                onClick={() => setVideoSource('camera')}
                className={`btn ${videoSource === 'camera' ? 'btn-primary' : 'btn-outline'}`}
            >
                카메라 사용
            </button>
            <button
                type="button"
                onClick={() => setVideoSource('file')}
                className={`btn ${videoSource === 'file' ? 'btn-primary' : 'btn-outline'}`}
            >
                비디오 파일 사용
            </button>
            {videoSource === 'file' && (
                <VideoFileSelector onSelect={(video) => setVideoFile(video)}/>
            )}
        </>
    )
}
