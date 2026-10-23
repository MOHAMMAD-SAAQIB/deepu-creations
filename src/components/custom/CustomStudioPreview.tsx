import React from 'react';
import { CustomStudio3DCanvas, CustomProductType } from './CustomStudio3DCanvas';

interface CustomPreviewProps {
  productType: CustomProductType;
  primaryColor: { name: string; hex: string };
  accentColor: { name: string; hex: string };
  sizeLabel: string;
  sizeIndex: number;
  customInitial?: string;
  fallbackImage?: string;
}

export const CustomStudioPreview: React.FC<CustomPreviewProps> = ({
  productType,
  primaryColor,
  accentColor,
  sizeLabel,
  sizeIndex,
  customInitial,
  fallbackImage,
}) => {
  return (
    <div className="w-full">
      <CustomStudio3DCanvas
        productType={productType}
        primaryColor={primaryColor}
        accentColor={accentColor}
        sizeLabel={sizeLabel}
        sizeIndex={sizeIndex}
        customInitial={customInitial}
        fallbackImage={fallbackImage}
      />
    </div>
  );
};
