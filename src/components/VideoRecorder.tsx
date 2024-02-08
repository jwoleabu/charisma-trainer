import {useRef} from "react";
import {createWorker, createScheduler} from "tesseract.js";
import data from "../data/data.ts";
import lines from "../data/lines.ts"
import sound from "/copyclick.mp3"
import Tesseract from "tesseract.js";

function VideoRecorder() {

    const videoref = useRef<HTMLVideoElement>(null)
    const canvasref = useRef<HTMLCanvasElement>(null)
    const ding = useRef<HTMLAudioElement>(null)
    let clipboard: string = "";


    const scheduler: Tesseract.Scheduler = createScheduler();
    let timer = null;
    let stream: MediaStream

    const displayMediaOptions : DisplayMediaStreamOptions = {
        video:{
            displaySurface: "window",
        }
    };
    const captureScreen = async () =>{
        try {
            stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            // console.log(stream);
            console.log('Streaming started')
            setInterval(captureVideo, 3000)
        }
        catch (error){
            console.log(error);
        }
    }
    const captureVideo = () =>{
        if (videoref.current && stream.active){
            const recorder: MediaRecorder = new MediaRecorder(stream)
            recorder.start()
            const buffer: BlobPart[] = []

            recorder.ondataavailable = (event)=>{
                buffer.push(event.data)
            }

            recorder.onstop = ()=>{
                const blob: Blob = new Blob(buffer, { type: 'video/webm' });
                if (videoref.current) videoref.current.src = URL.createObjectURL(blob);
                console.log("Video created")

            }
            setTimeout(()=>{
                recorder.stop()
            }, 2000)
        }
    }

    const detectLine = ((text: string)=>{
        let charismaWord = data.find(({word}) =>{
            return text.toLowerCase().includes(word.toLowerCase())
        })
        if (charismaWord){
            console.log(`Charisma line ${charismaWord.cid} detected from word ${charismaWord.word}`)
            let currentLine = lines[charismaWord.cid]
            if (clipboard != currentLine){
                navigator.clipboard.writeText(currentLine).then(()=>{
                    if (ding.current) ding.current.play()
                    clipboard = currentLine
                    console.log("Successful clipboard write")
                }).catch((error)=>{
                        console.error("Error writing to clipboard",error)
                    })
            }

        }
        else console.log("No cline detected")
    })


    const ocr =  async () => {
        const canvas = canvasref.current
        const video = videoref.current

        if (video && canvas) {
            canvas.width = video.videoWidth/2;
            canvas.height = video.videoHeight/2;

            const cropWidth = Math.min(video.videoWidth, canvas.width);
            const cropHeight = Math.min(video.videoHeight, canvas.height);
            const cropX = (video.videoWidth - cropWidth) / 2;
            const cropY = (video.videoHeight - cropHeight) / 2;

// Draw the cropped portion of the video on the canvas
            canvas.getContext('2d').drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

            // canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
            console.log(`${video.videoWidth}width , ${video.videoHeight}`)
            const {data: {text}} = await scheduler.addJob('recognize', canvas)
            detectLine(text)
            console.log(text)
            console.log("ocr phase")
        }
    }

        (async () => {
            try {
                console.log('Initializing Tesseract.js');
                for (let i = 0; i < 2; i++) {
                    console.log(`made worker ${scheduler.getNumWorkers()} are on site`)
                    const worker: Tesseract.Worker = await createWorker("eng");
                    scheduler.addWorker(worker);
                }
                console.log('Initialized Tesseract.js');
                if (videoref.current) {
                    videoref.current.onplay = () => {
                        console.log("starting OCR interval")
                        console.log(`${scheduler.getNumWorkers()} workers are here`)
                        ocr()
                    }
                }
                if (videoref.current) {
                    videoref.current.onended = () => {
                        console.log("terminating OCR interval")
                    }
                }
            } catch (error) {
                console.log('Error initializing Tesseract.js:', error);
            }
        })()


    return (
        <>
            <button onClick={captureScreen}>Click moi</button>
            <video ref={videoref} controls={true} autoPlay={true}></video>
            <canvas ref={canvasref}></canvas>
            <audio ref={ding}><source src={sound} type={"audio/mp3"}/></audio>
        </>
    )
}

export default VideoRecorder