"use client";
import React, { useEffect, useRef } from "react";

// 加载图片并返回 HTMLImageElement
function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // 允许跨域加载图片
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}



function getImageData(
  img: HTMLImageElement,
  rect: [number, number, number, number]
) {
  const canvas = new OffscreenCanvas(img.width, img.height); // 创建一个 OffscreenCanvas
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0); // 绘制图片
  const imageData = ctx?.getImageData(...rect); // 获取指定区域的 ImageData
  return imageData;
}

function traverseImageData(imageData: ImageData) {
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const avg = (r + g + b) / 3; // 计算 RGB 平均值
    imageData.data[i] = avg;
    imageData.data[i + 1] = avg;
    imageData.data[i + 2] = avg;
  }
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async function () {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      const img = await loadImage(
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
      );

      // 设置 Canvas 尺寸以匹配图片尺寸
      canvas.width = img.width;
      canvas.height = img.height;

      // 获取图片数据
      const imageData = getImageData(img, [0, 0, img.width, img.height]);
      if (!imageData) return;

      // 应用灰度化
      traverseImageData(imageData);

      // 将修改后的数据重新绘制到 Canvas 上
      if (context) {
        context.putImageData(imageData, 0, 0);
      }
    })();
  }, []);

  return (
    <div>
      <img src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" />
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}
