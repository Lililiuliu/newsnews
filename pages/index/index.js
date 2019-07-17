//测试github
var app = getApp();



Page({

  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    newsList: [{ //假数据
      img: "avatar.png",
      title: "未来电竞人才需求200万 薪资为拼滚工资1-3倍 引网友热议",
      soure: "新华网",
      date: 134,
      id:"",
    }],
    topNews: {
      img: null,
      title: "",
      soure: "",
      date: "",
      id:"",
    },
    type: ['国内', '国际', '军事', '体育', '娱乐', '其它'],
    typeCode: ['gn', 'gj', 'js', 'ty', 'yl', 'qt'],
    statusBarHeight: 0,
    navBarHeight: 0,
  },

  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    // this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

  onLoad: function() {
    var that = this;
    
    // 获取bar高度
    wx.getSystemInfo({
      success: function(res) {
        let navBarHeight = 0
        if (res.model.indexOf('iPhone') !== -1) {
          navBarHeight = 44
        } else {
          navBarHeight = 48
        }
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

    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    // 获取scrollview的margin-top
    var query = wx.createSelectorQuery();
    query.select('.tab-h').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        marginTop: res[0].bottom
      })
      console.log(res[0].bottom)
    })

    var typeCode = this.data.typeCode


    //获取接口数据

    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: typeCode[0]
      },
      success: res => {
        that.setTop(res)
      }
    })

  },

  setTop:function(e){
    console.log(e)

    let title = e.data.result[0].title
    let date = e.data.result[0].date
    let source = e.data.result[0].source
    let img = e.data.result[0].firstImage
    let id = e.data.result[0].id
    
    var topTitle = "topNews.title"
    var topDate = "topNews.date"
    var topSource = "topNews.source"
    var topImg = "topNews.img"
    var topId = "topNews.id"

    this.setData({
      [topTitle]:title,
      [topDate]: date.slice(11,16), 
      [topSource]: source,
      [topImg]: "http:"+img+".jepg",
      [id]: id
    })

    // //设置每小时天气列表
    // for (let i = 0; i < 8; i += 1) {
    //   hourWeather.push({
    //     time: (i * 3 + nowHour) % 24 + "时",
    //     iconPath: '/images/' + forecast[i].weather + '-icon.png',
    //     temp: forecast[i].temp + '°'
    //   })
    // }
  },

  //点击头图
  clickTop:function(event){
    console.log(event)
    wx.navigateTo({
      // url: '/pages/content/content?id='+'id'
    })
  }

  // footerTap: app.footerTap
})