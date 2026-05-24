"use client";

import Image from "next/image";
import { useState } from "react";

type SharedProps = {
  alt: string;
  insetClassName?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
};

type ShowcaseImageProps = SharedProps & {
  src: string;
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
};

function getFrameClassName(insetClassName?: string) {
  return [
    "absolute overflow-hidden rounded-[1.35rem] border border-black/6 bg-[#eadfce] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_rgba(17,17,17,0.08)]",
    insetClassName || "inset-4"
  ].join(" ");
}

export function ShowcaseImage({
  src,
  alt,
  sizes,
  priority,
  unoptimized,
  insetClassName,
  imageClassName,
  loading = "lazy"
}: ShowcaseImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={getFrameClassName(insetClassName)}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        unoptimized={unoptimized}
        aria-hidden="true"
        className="scale-110 object-cover object-center blur-2xl saturate-125"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-white/18 backdrop-blur-[1px]" />
      <div
        className={`absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(238,229,214,0.74))] transition duration-500 ${
          loaded ? "pointer-events-none opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        loading={priority ? undefined : loading}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`relative z-[1] object-contain object-center p-2.5 transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imageClassName || ""}`}
        sizes={sizes}
      />
    </div>
  );
}

export function ShowcaseNativeImage({
  src,
  alt,
  insetClassName,
  imageClassName,
  loading = "lazy"
}: SharedProps & { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={getFrameClassName(insetClassName)}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl saturate-125"
      />
      <div className="absolute inset-0 bg-white/18 backdrop-blur-[1px]" />
      <div
        className={`absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(238,229,214,0.74))] transition duration-500 ${
          loaded ? "pointer-events-none opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`relative z-[1] h-full w-full object-contain object-center p-2.5 transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imageClassName || ""}`}
      />
    </div>
  );
}
