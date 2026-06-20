import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 144,
          background: '#09090b', // zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#84cc16', // lime-500
          borderRadius: '48px',
          border: '12px solid #365314', // lime-900 border
        }}
      >
        ⚡
      </div>
    ),
    { ...size }
  );
}
