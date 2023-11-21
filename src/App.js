
import React, { useState } from 'react';
import './App.css';

const API_ENDPOINT = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';

function App() {
  const [comicText, setComicText] = useState(Array(10).fill(''));
  const [comicImages, setComicImages] = useState(Array(10).fill(null));

  const handleTextChange = (index, text) => {
    const newTextArray = [...comicText];
    newTextArray[index] = text;
    setComicText(newTextArray);
  };

  const generateComic = async () => {
    try {
      const images = await Promise.all(
        comicText.map(async (text) => {
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Accept': 'image/png',
              'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: text }),
          });

          if (!response.ok) {
            throw new Error(`Failed to generate image for: ${text}`);
          }

          return URL.createObjectURL(await response.blob());
        })
      );

      setComicImages(images);
    } catch (error) {
      console.error(error.message);
      // Handle error, show user feedback
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        {comicText.map((text, index) => (
          <textarea key={index} value={text} onChange={(e) => handleTextChange(index, e.target.value)} placeholder={`Panel ${index + 1}`} />
        ))}
        <button onClick={generateComic}>Generate Comic</button>
      </div>
      <div className="comic-container">
        {comicImages.map((image, index) => (
          <img key={index} src={image} alt={`Panel ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default App;
