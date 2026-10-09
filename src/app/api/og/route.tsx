import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'Kiran Kushal // Full-Stack Designer';
    const category = searchParams.has('category')
      ? searchParams.get('category')?.slice(0, 50)
      : 'Portfolio & Case Studies';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030303',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 1%, transparent 0%)',
            backgroundSize: '50px 50px',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '80px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '80%',
              height: '80%',
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: 20,
              }}
            >
              {category}
            </span>
            <h1
              style={{
                fontSize: 80,
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 40,
                color: 'white',
              }}
            >
              {title}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'white',
                  marginRight: 20,
                }}
              />
              <span style={{ fontSize: 32, fontWeight: 'bold' }}>Kiran Kushal</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e.message);
    return new Response('Failed to generate image', { status: 500 });
  }
}
