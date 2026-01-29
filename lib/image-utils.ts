/**
 * Client-side image compression utility
 * Compresses images to max 800KB before upload
 */

export async function compressImage(file: File, maxSizeKB: number = 500): Promise<File> {
    // If already small, return as-is
    if (file.size <= maxSizeKB * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions (max 1200px on longest side)
            const maxDim = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDim) {
                height = (height / width) * maxDim;
                width = maxDim;
            } else if (height > maxDim) {
                width = (width / height) * maxDim;
                height = maxDim;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            // Start with high quality, reduce if needed
            let quality = 0.8;
            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        // If still too big and quality > 0.3, try again
                        if (blob.size > maxSizeKB * 1024 && quality > 0.3) {
                            quality -= 0.1;
                            tryCompress();
                            return;
                        }

                        // Create new file from blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB`);
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            tryCompress();
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Generate a thumbnail for quick previews
 */
export async function generateThumbnail(file: File, maxDim: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDim) {
                height = (height / width) * maxDim;
                width = maxDim;
            } else if (height > maxDim) {
                width = (width / height) * maxDim;
                height = maxDim;
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };

        img.onerror = () => reject(new Error('Failed to generate thumbnail'));
        img.src = URL.createObjectURL(file);
    });
}
