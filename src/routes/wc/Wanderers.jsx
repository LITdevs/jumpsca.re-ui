import {useEffect, useState} from "react";
import api from "../../util/API";

export default function Wanderers() {
    let [wcFiles, setWcFiles] = useState([])

    useEffect(() => {
        (async () => {
            let files = await api.call("WC", "/file")
            setWcFiles(files.response.files)
        })();
    }, []);
    
    return (
        <>
            you dided it, this is WC
            {JSON.stringify(wcFiles)}
        </>
    )
}