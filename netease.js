/**
 * 网易云音乐插件
 * 支持：搜索 / 播放 / 歌词 / 导入歌单
 */

module.exports = {
  platform: "netease",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const results = [];
    try {
      const kw = encodeURIComponent(query);
      const res = await fetch(`https://api2.wer.plus/api/wyysearch?keywords=${kw}&limit=30`);
      const j = await res.json();
      if (j && j.result && j.result.songs) {
        j.result.songs.forEach(item => {
          results.push({
            id: `netease_${item.id}`,
            name: item.name,
            artist: item.artists.map(a => a.name).join(", "),
            album: item.album.name,
            duration: item.duration
          });
        });
      }
    } catch (e) {}
    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const id = item.id.replace("netease_", "");
      const res = await fetch(`https://api2.wer.plus/api/wyyurl?id=${id}`);
      const j = await res.json();
      return { url: j.data.url || null };
    } catch (e) {
      return { url: null };
    }
  },

  async getLyric(item) {
    try {
      const id = item.id.replace("netease_", "");
      const res = await fetch(`https://music.163.com/api/song/lyric?id=${id}&lv=1&kv=1&tv=-1`);
      const j = await res.json();
      return { lyric: j.lrc ? j.lrc.lyric : "" };
    } catch (e) {
      return { lyric: "" };
    }
  },

  async importPlaylist(url) {
    try {
      const enc = encodeURIComponent(url);
      const res = await fetch(`https://api.liguangchun.cn/v7/music/netEase?url=${enc}`);
      const j = await res.json();
      return j.playlist || [];
    } catch (e) {
      return [];
    }
  }
};
