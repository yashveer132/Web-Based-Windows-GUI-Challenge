import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--window-bg);
  color: var(--text-color);
  height: 100%;
  padding: 10px;
`;

const Instructions = styled.div`
  margin-bottom: 10px;
`;

const CropOverlay = styled.div`
  position: absolute;
  border: 2px dashed #ff0000;
  pointer-events: none;
`;

const CaptureButton = styled.button`
  margin-right: 5px;
  padding: 6px 12px;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--text-color);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Preview = styled.div`
  margin-top: 10px;
  border: 1px solid var(--window-border);
  background-color: #222;
  text-align: center;
  img {
    max-width: 100%;
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
  }, [isCropping, startPos]);

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
    if (addNotification) {
      addNotification("Draw a rectangle on screen for capture.");
    }
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

  return (
    <Container>
      <Instructions>
        <CaptureButton onClick={startCrop}>Start Cropping</CaptureButton>
        <CaptureButton onClick={capture}>Capture</CaptureButton>
        <p>1) Click "Start Cropping"</p>
        <p>2) Drag on the screen to select a region</p>
        <p>3) Click "Capture" to finalize</p>
      </Instructions>
      <Preview>
        {previewImg ? (
          <img src={previewImg} alt="capture" />
        ) : (
          <p>No capture yet.</p>
        )}
      </Preview>
      <CropOverlay
        ref={overlayRef}
        style={{ display: "none", position: "absolute" }}
      />
    </Container>
  );
}
