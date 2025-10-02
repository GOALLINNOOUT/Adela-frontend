import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import { Box, Slider, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';

// Utility to create a cropped image from a dataURL using canvas
async function getCroppedImg(imageSrc, pixelCrop, outputWidth) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const scale = outputWidth ? outputWidth / pixelCrop.width : 1;
  canvas.width = Math.round(pixelCrop.width * scale);
  canvas.height = Math.round(pixelCrop.height * scale);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

const ImageEditor = ({ src, onCancel, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(16 / 9);
  const [pixelCrop, setPixelCrop] = useState(null);
  const [outputWidth, setOutputWidth] = useState(1200);
  const [keepOriginal, setKeepOriginal] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setPixelCrop(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    try {
      if (keepOriginal) {
        // return the original data URL
        onComplete(src);
        return;
      }

      if (!pixelCrop) return;
      const dataUrl = await getCroppedImg(src, pixelCrop, Number(outputWidth));
      onComplete(dataUrl);
    } catch (e) {
      console.error('Failed to generate cropped image', e);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, p: 2 }}>
      <Box sx={{ position: 'relative', height: 480, bgcolor: 'grey.200' }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <Box sx={{ width: 200 }}>
          <Slider value={zoom} min={1} max={3} step={0.01} onChange={(e, v) => setZoom(v)} />
        </Box>
          <FormControlLabel
            control={(
              <Checkbox
                checked={keepOriginal}
                onChange={(e) => setKeepOriginal(e.target.checked)}
              />
            )}
            label="Keep original (no crop)"
            sx={{ ml: 1 }}
          />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Aspect</InputLabel>
          <Select
            value={aspect}
            label="Aspect"
            onChange={(e) => setAspect(Number(e.target.value))}
              disabled={keepOriginal}
          >
            <MenuItem value={16 / 9}>16:9</MenuItem>
            <MenuItem value={4 / 3}>4:3</MenuItem>
            <MenuItem value={1}>1:1</MenuItem>
            <MenuItem value={3 / 4}>3:4</MenuItem>
            <MenuItem value={9 / 16}>9:16</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Width</InputLabel>
          <Select
            value={String(outputWidth)}
            label="Width"
            onChange={(e) => setOutputWidth(Number(e.target.value))}
          >
            <MenuItem value={800}>800</MenuItem>
            <MenuItem value={1200}>1200</MenuItem>
            <MenuItem value={1600}>1600</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply</Button>
        </Box>
      </Box>
    </Box>
  );
};

ImageEditor.propTypes = {
  src: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ImageEditor;
