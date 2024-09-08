import { useEffect, useState } from 'react';
import { getColors, Colors } from 'react-native-image-colors';

interface UseImageColorsProps {
  imageUri: string;
}

const useImageColors = ({ imageUri }: UseImageColorsProps) => {
  const [colors, setColors] = useState<Colors | null>(null);

  useEffect(() => {
    if (!imageUri) {
      console.warn('No image URI provided');
      return;
    }

    const fetchColors = async () => {
      try {
        const colorData = await getColors(imageUri, {
          fallback: "#228B22", // A green fallback color
          cache: true,
          key: imageUri,
        });
        setColors(colorData);
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    };

    fetchColors();
  }, [imageUri]);

  return colors;
};

export default useImageColors;
