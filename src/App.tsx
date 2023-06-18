import React, { useCallback, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { ClipLoader } from 'react-spinners';
import TypewriterComponent from 'typewriter-effect';
import axios from './axios';
import UploadIcon from './assets/upload_icon.png';
import './App.css';

const fileTypes = ["WAV", "MP3", "MP4", "WEBM"];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [script, setScript] = useState("");
  const [scriptRendered, setScriptRendered] = useState(false);
  const handleChange = (file: File) => {
    setFile(file);
  };

  const uploadFile = useCallback(async (file: File) => {
    if (file) {
      const fromData = new FormData();
      fromData.append('record', file!)
      const options = {
        method: 'POST',
        url: '/api/upload_record',
        headers: {
          accept: 'application/json',
        },
        data: fromData
      };
  
      const result = await axios.request(options)
      console.log(result);
      return result.data.file_name; // return file_name instead of result.data
    }
  }, [])

  const deepgramProcessing = useCallback(async (fileName: any) => {
    if (fileName) {
      const options = {
        method: 'POST',
        url: '/api/get_transcript',
        headers: {
          accept: 'application/json',
        },
        file_name: fileName // send file_name as the body
      };
  
      const result = await axios.request(options)
  
      return result.data
    }
  }, [])

  const openAICompletion = useCallback(async (fileName: string) => {
    if (fileName) {
      const options = {
        method: 'POST',
        url: '/api/get_script',
        headers: {
          accept: 'application/json',
        },
        data: {
          fileName: fileName,
          setOrCloseCall: 'close',
          generateSingleSpeakerFiles: true,
          useSingleSpeakerText: true,
          useContinue: true
        }
      };
  
      const result = await axios.request(options)
  
      return result.data
    }
  }, [])


  const handleScripting = useCallback(async (file: File) => {
    const fileName = await uploadFile(file);
    await deepgramProcessing(fileName);
    setUploading(false)
    setAnalysing(true)
    const script = await openAICompletion(fileName);
    let formatted_script = "";
    const script_lines = script.split('\n');
    for (const script_line of script_lines) {
      if (script_line.trim()) {
        formatted_script += `<span>${script_line.trim()}</span><br/>`
      }
    }
    setAnalysing(false)
    setScript(formatted_script)
  }, [uploadFile, deepgramProcessing, openAICompletion])

  const handleCopy = () => {
    navigator.clipboard.writeText(script)
  }


  useEffect(() => {
    if (file) {
      setAnalysing(true);
      handleScripting(file)
    }
  }, [file, handleScripting])
  return (
    <div className="App">
      <div className='container'>
        {
          !uploading && !analysing && !script && (
            <>
              <h2 className='text-3xl font-bold mb-4 title'>Upload A Call Recording</h2>
              <p className='mb-8'>Clone your best rep by uploading a call recording from them and we'll magically create a script for your Air Agent to follow based on it. </p>
              <div className='h-320px'>

                <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
                  <div className='w-full text-center border border-dotted border-black rounded-xl p-4 h-full flex flex-col justify-center items-center cursor-pointer'>
                    <img src={UploadIcon} width={32} className='mb-4' alt='upload-icon' />
                    <p>Click to upload audio from computer</p>
                    <p className='text-gray-500'>or drag and drop here</p>
                  </div>
                </FileUploader>

              </div>
            </>
          )
        }
        {
          uploading && (
            <>
              <h2 className='text-3xl font-bold title'>Uploading Call...</h2>
              <div className='h-320px'>
                <div className='w-full p-4 h-full flex flex-col justify-center items-center'>
                  <ClipLoader />
                </div>
              </div>
            </>
          )
        }
        {
          analysing && (
            <>
              <h2 className='text-3xl font-bold title'>Analyzing Call...</h2>
              <div className='h-320px'>
                <div className='w-full p-4 h-full flex flex-col justify-center items-center'>
                  <ClipLoader size={45} />
                </div>
              </div>
            </>
          )
        }
        {
          !analysing && !uploading && script.length > 0 && (
            <>
              {
                !scriptRendered && (
                  <h2 className='text-3xl font-bold title'>Cloning Your Best Rep...</h2>
                )
              }
              {
                scriptRendered && (
                  <h2 className='text-2xl font-bold title'>Cloning Successful! Copy Your Script Below</h2>
                )
              }
              <div className='h-320px w-full mt-8'>
                <div className='w-full text-left border border-solid border-black rounded-xl p-4 h-full flex flex-col justify-start items-start overflow-auto'>
                {
                  !scriptRendered && (
                    <TypewriterComponent
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(script)
                        .callFunction(() => {
                          setScriptRendered(true)
                        })
                        .start();
                    }}
                    options={{
                      delay: 20
                    }}
                  />
                  )
                }
                {
                  scriptRendered && (
                    <div className='Typewriter__wrapper' dangerouslySetInnerHTML={{__html: script}}></div>
                  )
                } 
                </div>
              </div>
              <div className='w-full flex justify-center mt-4'>
                {
                  !scriptRendered && (
                    <button disabled className="flex justify-center rounded-md bg-gray-600 px-6 py-1.5 leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Copy Script</button>
                  )
                }
                {
                  scriptRendered && (
                    <button onClick={handleCopy} className="flex justify-center rounded-md bg-indigo-600 px-6 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Copy Script</button>
                  )
                }
              </div>
            </>
          )
        }
      </div>
    </div>

  );
}

export default App;
