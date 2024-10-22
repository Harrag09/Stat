import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Quagga from 'quagga';

const QRScanner = () => {
    const [code, setCode] = useState("");
    const [scanResult, setScanResult] = useState(null);

 

    const handleImageChange = async (event) => {
      const file = event.target.files[0];
  
      if (file) {
          const image = new Image();
          image.src = URL.createObjectURL(file);
  
          image.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = image.width;
              canvas.height = image.height;
  
              const ctx = canvas.getContext('2d');
              ctx.drawImage(image, 0, 0);
  
              canvas.toBlob((blob) => {
                  const jpegFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
                  Quagga.decodeSingle(
                      {
                          src: URL.createObjectURL(jpegFile),
                          numOfWorkers: 0,
                          inputStream: {
                              size: 800
                          },
                          decoder: {
                              readers: ['ean_reader', 'code_128_reader', 'upc_reader']
                          }
                      },
                      (result) => {
                          setScanResult(result);
                          if (result && result.codeResult) {
                              setCode(result.codeResult.code);
                           //   console.log("Barcode detected:", result.codeResult.code);
                          } else {
                           //   console.log("No barcode detected");
                          }
                      }
                  );
              }, 'image/jpeg');
          };
      }
  };

    return (
        <div className="content">
            <label>You need to take a photo of the barcode:</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <div>Code: {code && code}</div>
            <div>Scan Result: {scanResult && JSON.stringify(scanResult)}</div>
        </div>
    );
};

export default QRScanner;

