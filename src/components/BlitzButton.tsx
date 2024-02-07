function BlitzButton() {

    const captureScreen = async () =>{
        try {
            const stream :MediaStream = await navigator.mediaDevices.getDisplayMedia();

            console.log(stream);
        }
        catch (error){
            console.log(error);
        }
    }
    return(
        <button onClick={captureScreen}>Click moi</button>
    )
}

export default BlitzButton