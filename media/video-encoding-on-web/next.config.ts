import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        source: '/test/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          }
        ]
      }
    ];
  }
};

export default nextConfig;
