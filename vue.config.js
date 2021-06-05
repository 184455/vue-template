module.exports = {
  publicPath: './',
  devServer: {
    port: 8989,
    proxy: {
      '/api/get-home-slider': {
        target: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1547465715699',
        changeOrigin: true,
        headers: {
          // referer: 'https://c.y.qq.com/',
          // host: 'c.y.qq.com'
        }
      }
    }
  }
}
