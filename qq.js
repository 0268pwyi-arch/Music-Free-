/**
 * QQ 音乐插件
 * 支持：搜索 / 播放 / 歌词（如可用）
 */

module.exports = {
  platform: "qqmusic",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const results = [];
    try {
      const kw = encodeURIComponent(query);
      const res = await fetch(`https://api2.wer.plus/api/qqsearch?keywords=${kw}&limit=30`);
      const j = await res.json();
      if (j && j.data && j.data.song && j.data.song.list) {
        j.data.song.list.forEach(item => {
          results.push({
            id: `qq_${item.songmid}`,
            name: item.songname,
            artist: item.singer.map(s => s.name).join(", "),
            album: item.albumname,
            duration: item.interval * 1000
          });
        });
      }
    } catch (e) {}
    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const mid = item.id.replace("qq_", "");
      const res = await fetch(`https://api2.wer.plus/api/qqplay?mid=${mid}`);
      const j = await res.json();
      return { url: j.data.url || null };
    } catch (e) {
      return { url: null };
    }
  },

  async getLyric(item) {
    try {
      const mid = item.id.replace("qq_", "");
      const res = await fetch(`https://api2.wer.plus/api/qqlyric?mid=${mid}`);
      const j = await res.json();
      return { lyric: j.data.lyric || "" };
    } catch (e) {
      return { lyric: "" };
    }
  },

  async importPlaylist(url) {
    return []; // QQ 歌单支持较差，可后续增强
  }
};
