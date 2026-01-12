/**
 * 酷狗音乐插件
 * 支持：搜索 / 播放
 * 歌词与歌单可在后续版本增加
 */

module.exports = {
  platform: "kugou",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const results = [];
    try {
      const kw = encodeURIComponent(query);
      const res = await fetch(`https://api2.wer.plus/api/kgsearch?keyword=${kw}&page=${page}`);
      const j = await res.json();
      (j.data.list || []).forEach(item => {
        results.push({
          id: `kugou_${item.FileHash}`,
          name: item.SongName,
          artist: item.SingerName,
          album: item.AlbumName || "",
          duration: item.Duration * 1000
        });
      });
    } catch (e) {}
    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const hash = item.id.replace("kugou_", "");
      const res = await fetch(`https://api2.wer.plus/api/kgplay?hash=${hash}`);
      const j = await res.json();
      return { url: j.data.url || null };
    } catch (e) {
      return { url: null };
    }
  },

  async getLyric(item) {
    return { lyric: "" }; // 酷狗歌词暂不统一接口
  },

  async importPlaylist(url) {
    return [];
  }
};
