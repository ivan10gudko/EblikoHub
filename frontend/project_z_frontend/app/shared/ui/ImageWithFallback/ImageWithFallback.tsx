import { useState } from "react";

interface ImageWithFallbackProps {
    src?: string | null; // основне джерело, може бути undefined або null
    fallback: string;    // запасне джерело
    alt: string;
    className?: string;
}

export function ImageWithFallback({ src, fallback, alt, className }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState<string>(src ?? fallback);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (imgSrc !== fallback) setImgSrc(fallback);
            }}
        />
    );
}
