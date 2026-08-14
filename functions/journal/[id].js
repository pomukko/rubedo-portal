// functions/journal/[id].js
export async function onRequest(context) {
  const { params, request, env } = context;
  const id = params.id;

  // 👑 大元の index.html を確実に取得
  const url = new URL(request.url);
  const indexUrl = new URL('/', url.origin);
  const response = await env.ASSETS.fetch(indexUrl);

  const serviceDomain = "rubedo";
  const apiKey = "k9QtCRl15P3IEH9GOSfrQ2ULEspVtCnwv3Bi";

  try {
    // microCMSから記事データを直接取得
    const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/articles/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': apiKey }
    });

    if (res.ok) {
      const article = await res.json();
      const title = article.title ? `${article.title} | RUBEDO PORTAL` : 'RUBEDO PORTAL';
      const desc = article.lead || article.summary || 'RUBEDO JOURNAL';
      // アイキャッチ、単一画像、または記事内画像を取得
      const image = article.eyecatch?.url || article.image?.url || article.photo?.url || article.singleImage?.url || '';

      // DiscordやTwitter向けにタイトルと画像を記事専用のものに書き換え
      return new HTMLRewriter()
        .on('title', { element(e) { e.setInnerContent(title); } })
        .on('meta[name="description"]', { element(e) { e.setAttribute('content', desc); } })
        .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', title); } })
        .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', desc); } })
        .on('meta[property="og:image"]', { element(e) { if (image) e.setAttribute('content', image); } })
        .on('meta[name="twitter:title"]', { element(e) { e.setAttribute('content', title); } })
        .on('meta[name="twitter:description"]', { element(e) { e.setAttribute('content', desc); } })
        .on('meta[name="twitter:image"]', { element(e) { if (image) e.setAttribute('content', image); } })
        .transform(response);
    }
  } catch (err) {
    // エラー時は通常のindex.htmlを返す
  }

  return response;
}