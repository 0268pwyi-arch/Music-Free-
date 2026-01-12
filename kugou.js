/**
 * MusicFree 插件 — 酷狗音乐
 * 支持：搜索 / 播放 / 歌词（如可用）
 */
module.exports = {
  platform: "kugou",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const kw = encodeURIComponent(query);
    let results = [];

    try {
      const res = await fetch(
        `https://api2.wer.plus/api/kgsearch?keyword=${kw}&page=${page}`
      );
      const j = await res.json();
      (j.data.list || []).forEach(item => {
        results.push({
          id: `kugou_${item.FileHash}`,
          name: item.SongName,
          artist: item.SingerName,
          album: "",
          duration: 0,
          type: "music"
        });
      });
    } catch (e) {}

    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const hash = item.id.replace("kugou_", "");
      const res = await fetch(
        `https://api2.wer.plus/api/kgplay?hash=${hash}`
      );
      const j = await res.json();
      return { url: j.data && j.data.url };
    } catch (e) {
      return { url: null };
    }
  }
};
