import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e2f;
  color: white;
  font-family: "Arial, sans-serif";
  padding: 20px;
  gap: 20px;
`;

const Instructions = styled.div`
  text-align: center;
  line-height: 1.8;
`;

const CropOverlay = styled.div`
  position: fixed;
  border: 2px dashed #ff4f4f;
  pointer-events: none;
  background-color: rgba(255, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const CaptureButton = styled.button`
  padding: 12px 20px;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab7;
  }
`;

const ResetButton = styled(CaptureButton)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;

const DownloadButton = styled(CaptureButton)`
  background-color: #5cb85c;

  &:hover {
    background-color: #4cae4c;
  }
`;

const Preview = styled.div`
  width: 80%;
  max-width: 800px;
  text-align: center;
  margin-top: 20px;
  border: 1px solid #333;
  background-color: #29293d;
  border-radius: 8px;
  padding: 15px;
  line-height: 1.6;

  img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    border-radius: 5px;
  }
`;

export default function ScreenCaptureTool({
  addNotification,
  fileSystem,
  createFile,
}) {
  const [isCropping, setIsCropping] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const overlayRef = useRef(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!isCropping) return;
      setStartPos({ x: e.clientX, y: e.clientY });
      setCropRect({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
    };

    const handleMouseMove = (e) => {
      if (!isCropping || !startPos) return;
      const rectX = Math.min(startPos.x, e.clientX);
      const rectY = Math.min(startPos.y, e.clientY);
      const rectW = Math.abs(e.clientX - startPos.x);
      const rectH = Math.abs(e.clientY - startPos.y);
      setCropRect({ x: rectX, y: rectY, w: rectW, h: rectH });
    };

    const handleMouseUp = () => {
      if (isCropping) {
        setIsCropping(false);
        if (addNotification)
          addNotification("Cropping completed. Click 'Capture' to save.");
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isCropping, startPos, addNotification]);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (cropRect) {
      overlayRef.current.style.display = "block";
      overlayRef.current.style.left = cropRect.x + "px";
      overlayRef.current.style.top = cropRect.y + "px";
      overlayRef.current.style.width = cropRect.w + "px";
      overlayRef.current.style.height = cropRect.h + "px";
    } else {
      overlayRef.current.style.display = "none";
    }
  }, [cropRect]);

  const startCrop = () => {
    setIsCropping(true);
    setStartPos(null);
    setCropRect(null);
    if (addNotification)
      addNotification("Draw a rectangle on the screen for capture.");
  };

  const capture = async () => {
    if (!cropRect || cropRect.w === 0 || cropRect.h === 0) {
      if (addNotification) addNotification("No selection to capture!");
      return;
    }
    try {
      const fullCanvas = await html2canvas(document.body);
      const ctx = fullCanvas.getContext("2d");
      const imageData = ctx.getImageData(
        cropRect.x,
        cropRect.y,
        cropRect.w,
        cropRect.h
      );

      const newCanvas = document.createElement("canvas");
      newCanvas.width = cropRect.w;
      newCanvas.height = cropRect.h;
      const newCtx = newCanvas.getContext("2d");
      newCtx.putImageData(imageData, 0, 0);

      const dataUrl = newCanvas.toDataURL("image/png");
      setPreviewImg(dataUrl);

      if (createFile) {
        const fileName = "Capture_" + Date.now() + ".png";
        createFile("C:/Pictures", fileName, dataUrl);
        if (addNotification) {
          addNotification(`Screen captured and saved: ${fileName}`);
        }
      }
    } catch (error) {
      console.error(error);
      if (addNotification) {
        addNotification("Capture failed!");
      }
    }
  };

  const downloadCapture = () => {
    if (!previewImg) return;
    const link = document.createElement("a");
    link.href = previewImg;
    link.download = "screencapture.png";
    link.click();
  };

  return (
    <Container>
      <Instructions>
        <h2>Screen Capture Tool</h2>
        <p>1) Click "Start Cropping" to draw a selection.</p>
        <p>2) Once selected, click "Capture" to take a screenshot.</p>
        <p>3) Download or view the capture in the preview section below.</p>
      </Instructions>

      <ButtonContainer>
        <CaptureButton onClick={startCrop}>Start Cropping</CaptureButton>
        <CaptureButton onClick={capture}>Capture</CaptureButton>
        <ResetButton onClick={() => setCropRect(null)}>Reset</ResetButton>
        {previewImg && (
          <DownloadButton onClick={downloadCapture}>
            Download Capture
          </DownloadButton>
        )}
      </ButtonContainer>

      <Preview>
        {previewImg ? (
          <img src={previewImg} alt="Screen capture preview" />
        ) : (
          <p>No captures yet.</p>
        )}
      </Preview>

      <CropOverlay ref={overlayRef} style={{ display: "none" }} />
    </Container>
  );
}
