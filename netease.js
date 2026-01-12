/**
 * MusicFree 插件 — 网易云音乐
 * 支持：搜索 / 播放 / 歌词 / 歌单
 */
module.exports = {
  platform: "netease",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const kw = encodeURIComponent(query);
    let results = [];

    try {
      const res = await fetch(
        `https://api2.wer.plus/api/wyysearch?keywords=${kw}&limit=30`
      );
      const j = await res.json();
      if (j && j.result && j.result.songs) {
        j.result.songs.forEach(item => {
          results.push({
            id: `netease_${item.id}`,
            name: item.name,
            artist: item.artists ? item.artists.map(a => a.name).join(", ") : "",
            album: item.album ? item.album.name : "",
            duration: item.duration || 0,
            type: "music"
          });
        });
      }
    } catch (e) {}

    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const id = item.id.replace("netease_", "");
      const res = await fetch(
        `https://api2.wer.plus/api/wyyurl?id=${id}`
      );
      const j = await res.json();
      return { url: j.data && j.data.url };
    } catch (e) {
      return { url: null };
    }
  },

  async getLyric(item) {
    try {
      const id = item.id.replace("netease_", "");
      const res = await fetch(
        `https://music.163.com/api/song/lyric?os=pc&id=${id}`
      );
      const j = await res.json();
      return { lyric: j.lrc ? j.lrc.lyric : "" };
    } catch (e) {
      return { lyric: "" };
    }
  },

  async getPlaylist(id) {
    try {
      const res = await fetch(
        `https://api.liguangchun.cn/v7/music/netEase?url=${encodeURIComponent(
          id
        )}`
      );
      const j = await res.json();
      return j.playlist || [];
    } catch (e) {
      return [];
    }
  }
};
