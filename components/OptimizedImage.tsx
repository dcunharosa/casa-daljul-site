'use client';

import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
    containerClassName?: string;
    revealDuration?: number;
}

export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    revealDuration = 700,
    priority,
    fill,
    width,
    height,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-stone-100", containerClassName)}>
            <div
                className={cn(
                    "h-full w-full transition-opacity ease-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDuration: `${revealDuration}ms` }}
            >
                <Image
                    src={src}
                    alt={alt}
                    className={cn("object-cover", className)}
                    priority={priority}
                    onLoad={() => setIsLoaded(true)}
                    fill={fill}
                    width={width}
                    height={height}
                    {...props}
                />
            </div>
        </div>
    );
}
