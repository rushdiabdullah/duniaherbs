/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'llcseahgpcjlfmfrnxef.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'cdswdwhdupcsblmqutuv.supabase.co', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      { source: '/IMG_0587.MP4', destination: '/videos/IMG_0587.MP4' },
      { source: '/IMG_0596.MP4', destination: '/videos/IMG_0596.MP4' },
      { source: '/IMG_0605.MP4', destination: '/videos/IMG_0605.MP4' },
      { source: '/IMG_0611.MP4', destination: '/videos/IMG_0611.MP4' },
    ];
  },
};

export default nextConfig;
