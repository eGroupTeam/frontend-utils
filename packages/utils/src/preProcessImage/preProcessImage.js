import calculateAspectRatioFit from './calculateAspectRatioFit';
import resetOrientation from './resetOrientation';

/**
 * Compress and resize image and keep aspect ratio.
 *
 * @param {Node} canvas Canvas element
 * @param {Node} img Image element
 * @param {Object} options
 * @param {String} options.type ['image/jpeg'] compressed image type
 * @param {Number} options.quality [1] compressed image quality
 * @param {Number} options.maxWidth [1920] compressed image max width
 * @param {Number} options.maxHeight [1920] compressed image max height
 * @param {Boolean} options.orientation provide image orientation to reset it
 */
const preProcessImage = (canvas, img, options) => {
  const {
    type = 'image/jpeg',
    quality = 1,
    maxWidth = 1920,
    maxHeight = 1920,
    orientation
  } = options || {};
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      // Shrinking image
      const { width, height } = calculateAspectRatioFit(
        img.width,
        img.height,
        maxWidth,
        maxHeight
      );
      // Set canvas width and height.
      canvas.width = width;
      canvas.height = height;

      if (orientation) {
        resetOrientation(canvas, ctx, width, height, orientation);
      }

      // Draw canvas.
      ctx.drawImage(img, 0, 0, width, height);
      // Convert back to blob.
      canvas.toBlob(resolve, type, quality);
    } catch (error) {
      reject(error);
    }
  });
};

export default preProcessImage;
