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
};

export default nextConfig;
