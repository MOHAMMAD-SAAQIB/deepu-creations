/**
 * Deepu Creations — Persistent Image Storage & Processing Utility
 * 
 * Supports manual admin uploads from device.
 * Validates file types, enforces size limits, and persists images as standard Data URIs.
 * Never generates or substitutes AI images.
 */

export interface ProcessedImageResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const MAX_DIMENSION_PX = 1200; // Optimal for high-res product viewing without memory bloat

/**
 * Validates and converts an admin-selected device file into a persistent Data URI.
 */
export async function processProductImageFile(file: File): Promise<ProcessedImageResult> {
  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      success: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, WEBP, or GIF image.`,
    };
  }

  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      success: false,
      error: `File size too large (${sizeInMB} MB). Maximum allowed size is 5 MB.`,
    };
  }

  // 3. Read file into Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        resolve({
          success: false,
          error: 'Failed to read image file data.',
        });
        return;
      }

      // Optimize image dimensions via canvas to prevent storage limits
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION_PX) / width);
            width = MAX_DIMENSION_PX;
          } else {
            width = Math.round((width * MAX_DIMENSION_PX) / height);
            height = MAX_DIMENSION_PX;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.9);
            resolve({
              success: true,
              dataUrl: optimizedDataUrl,
              fileName: file.name,
              fileSize: file.size,
            });
            return;
          }
        }

        resolve({
          success: true,
          dataUrl: rawDataUrl,
          fileName: file.name,
          fileSize: file.size,
        });
      };

      img.onerror = () => {
        resolve({
          success: false,
          error: 'Image file appears to be corrupted or cannot be decoded.',
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Error reading file from your device.',
      });
    };

    reader.readAsDataURL(file);
  });
}
