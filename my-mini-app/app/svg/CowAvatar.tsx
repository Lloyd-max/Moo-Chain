
import React from 'react';

type CowAvatarProps = {
  cowId: number;
};

const CowAvatar: React.FC<CowAvatarProps> = ({ cowId }) => {
  const seed = cowId.toString();
  const primaryColor = `#${seed.slice(0, 6).padEnd(6, '0')}`;
  const secondaryColor = `#${seed.slice(6, 12).padEnd(6, '0')}`;
  const spotType = parseInt(seed.slice(2, 3), 10) % 3;

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full rounded-full"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Body */}
      <circle cx="50" cy="50" r="40" fill={secondaryColor} />

      {/* Spots */}
      {spotType === 0 && (
        <>
          <circle cx="30" cy="40" r="10" fill={primaryColor} />
          <circle cx="70" cy="60" r="12" fill={primaryColor} />
        </>
      )}
      {spotType === 1 && (
        <>
          <ellipse cx="35" cy="60" rx="15" ry="8" fill={primaryColor} />
          <ellipse cx="65" cy="35" rx="12" ry="6" fill={primaryColor} />
        </>
      )}
      {spotType === 2 && (
        <>
          <rect x="25" y="30" width="15" height="10" fill={primaryColor} />
          <rect x="60" y="55" width="20" height="12" fill={primaryColor} />
        </>
      )}

      {/* Eyes */}
      <circle cx="40" cy="45" r="3" fill="black" />
      <circle cx="60" cy="45" r="3" fill="black" />

      {/* Nose */}
      <ellipse cx="50" cy="65" rx="10" ry="5" fill="#FBCFE8" />
      <circle cx="47" cy="65" r="1.5" fill="black" />
      <circle cx="53" cy="65" r="1.5" fill="black" />
    </svg>
  );
};

export default CowAvatar;