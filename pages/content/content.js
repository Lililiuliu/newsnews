
Page({

  data: {
    id:'',
    statusBarHeight: '',
    navBarHeight: '',
    percent:'80',
    info:{
      title:'',
      source:'',
      time:'',
      visited:'',
      content: []
    },
  },

  onLoad: function (options) {

    //获取内容id
    this.setData({
      id: options.id
    })

    let that = this;

    // 获取bar高度
    wx.getSystemInfo({
      success: function (res) {
        let navBarHeight = res.model.indexOf('iPhone') !== -1 ? 44 : 48
        that.setData({
          statusBarHeight: res.statusBarHeight,
          navBarHeight: navBarHeight
        });
      },
      failure() {
        that.setData({
          statusBarHeight: 0,
          navBarHeight: 0
        });
      }
    })

    this.getData()
  },

  //左上角返回 
  back(){
    wx.navigateBack({
      delta: 1
    })

  },

  //获取接口数据
  getData(callback) {

    let id = this.data.id
    let that = this

    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: id
      },

      success: res => {
        that.setContent(res)
      },

      complete: () => {
        that.setData({
          percent:100  
        })
      }
    })

  },

  setContent(e){
    let result = e.data.result

    let title = result.title
    let date = result.date
    let source = result.source
    let readCount = result.readCount
    let content = result.content

    const _title = 'info.title'
    const _time = 'info.time'
    const _source = 'info.source'
    const _visited = 'info.visited'
    const _content = 'info.content'

    let htmlContent = ''

    for (let i = 0; i < content.length; i += 1) {

      if (content[i].type == "p") {
        htmlContent += '<p class="p">' + content[i].text + '</p>'
      } else if (content[i].type == "strong") {
        htmlContent += '<p class="strong">' + content[i].text + '</p>'
      } else{
        htmlContent += '<img class="img" src="http:' + content[i].src + '"></img>'
      }
    }

    this.setData({
      [_title]: title ,
      [_time]: date.slice(11, 16),
      [_source]: source,
      [_visited]: '阅读 ' + readCount,
      [_content]: htmlContent
    })
    



  }

})