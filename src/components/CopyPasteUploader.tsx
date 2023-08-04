import React, { useState } from 'react';
import Title from './Title';
import Button from './Button';

const CopyPasteUploader = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [originalScript, setOriginalScript] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalScript(e.target.value);
  };
  const handleSubmit = () => { onSubmit(originalScript) }
  return (
    <>
      <Title>
        Upload Your Script
      </Title>
      <p className='mb-8 px-20'>
        Upload your script and we'll automatically clean it up to make it much easier for your Air Agent to understand and follow.
      </p>
      <textarea
        className='h-60 w-full border border-custom-color border-black rounded-xl p-4'
        value={originalScript}
        onChange={handleChange}
        placeholder='Copy and paste your original script here that you want to clean up...'
      />
      <div className='w-full flex justify-center mt-4'>
        <Button onClick={handleSubmit} disabled={!originalScript.length}>
          Next Step
        </Button>
      </div>
    </>
  )
}

export default CopyPasteUploader;
