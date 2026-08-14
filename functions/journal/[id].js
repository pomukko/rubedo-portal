// functions/journal/[id].js
export async function onRequest(context) {
  const { params } = context;
  const id = params.id;
  const response = await context.next();

  const serviceDomain = "rubedo";
  const apiKey = "k9QtCRl15P3IEH9GOSfrQ2ULEspVtCnwv3Bi";

  try {
    // microCMSから該当記事のデータを直接取得
    const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/articles/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': apiKey }
    });

    if (res.ok) {
      const article = await res.json();
      const title = article.title ? `${article.title} | RUBEDO PORTAL` : 'RUBEDO PORTAL';
      const desc = article.lead || 'RUBEDO JOURNAL';
      // アイキャッチまたは記事内画像
      const image = article.eyecatch?.url || article.image?.url || '';

      // DiscordやTwitterのロボット向けにHTMLを記事情報へ書き換え
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
    // エラー時は通常のレスポンスを返す
  }

  return response;
}