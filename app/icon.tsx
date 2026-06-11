import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#09090b', // zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06b6d4', // cyan-500
          borderRadius: '8px',
          border: '2px solid #164e63', // cyan-900 border
        }}
      >
        ⚡
      </div>
    ),
    { ...size }
  );
}
