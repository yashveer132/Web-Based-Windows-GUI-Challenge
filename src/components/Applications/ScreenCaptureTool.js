import React, { useEffect, useState, useRef } from "react";
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
  @media (max-width: 1024px) {
    padding: 18px;
    gap: 18px;
  }
  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
`;

const Instructions = styled.div`
  text-align: center;
  line-height: 1.8;
  h2 {
    font-size: 1.8rem;
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }
  p {
    font-size: 1rem;
    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
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
  @media (max-width: 768px) {
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 480px) {
    gap: 10px;
  }
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
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
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

export default function ScreenCaptureTool({ addNotification, createFile }) {
  const [isCropping, setIsCropping] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const overlayRef = useRef(null);

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
      const scale = window.devicePixelRatio;
      const newCanvas = document.createElement("canvas");
      newCanvas.width = cropRect.w * scale;
      newCanvas.height = cropRect.h * scale;
      const newCtx = newCanvas.getContext("2d");

      newCtx.drawImage(
        fullCanvas,
        cropRect.x * scale,
        cropRect.y * scale,
        cropRect.w * scale,
        cropRect.h * scale,
        0,
        0,
        cropRect.w * scale,
        cropRect.h * scale
      );

      const dataURL = newCanvas.toDataURL("image/png");
      if (createFile) {
        const fileName = "Capture_" + Date.now() + ".png";
        createFile("C:/Pictures", fileName, dataURL);
        if (addNotification) {
          addNotification(`Screen captured and saved: ${fileName}`);
        }
      }
      downloadImage(dataURL);
    } catch (error) {
      console.error(error);
      if (addNotification) {
        addNotification("Capture failed!");
      }
    }
  };

  const downloadImage = (dataURL) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "screencapture.png";
    link.click();
  };

  return (
    <Container>
      <Instructions>
        <h2>Screen Capture Tool</h2>
        <p>1) Click "Start Cropping" to draw a selection.</p>
        <p>2) Once selected, click "Capture" to take a screenshot.</p>
      </Instructions>
      <ButtonContainer>
        <CaptureButton onClick={startCrop}>Start Cropping</CaptureButton>
        <CaptureButton onClick={capture}>Capture</CaptureButton>
        <ResetButton onClick={() => setCropRect(null)}>Reset</ResetButton>
      </ButtonContainer>
      <CropOverlay ref={overlayRef} style={{ display: "none" }} />
    </Container>
  );
}
