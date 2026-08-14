// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description = "RUBEDO - 3Dアセットアーカイブ & クリエイティブポータル", 
  image = "/favicon.svg", 
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = "article"
}) {
  const siteTitle = "RUBEDO PORTAL";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      {/* ページタイトル & 基本メタ */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph (SNS共通) */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter (X) カード */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}