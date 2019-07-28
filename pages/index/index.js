var app = getApp();

Page({

  data: {
    swiperHeight: "", //swiper高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    newsList: [{ 
      img: "",
      title: "",
      soure: "",
      date: "",
      id:"",
    }],
    topNews: {
      img: null,
      title: "",
      source: "",
      date: "",
      id:"",
    },
    type: ['国内', '国际', '财经', '娱乐', '军事', '体育','其它'],
    typeCode: ['gn', 'gj', 'cj', 'yl', 'js', 'ty','other'],
    statusBarHeight: 0,
    navBarHeight: 0,
  },

  // 滚动切换标签
  switchTab: function(e) {

    this.setData({
      currentTab: e.detail.current
    });
    this.getData()
    this.getSwiperHeight()
  },


  // 点击标题切换
  swichNav: function(e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    this.getData()
  },

  onLoad: function() {
    let that = this;
    // 获取bar高度
    wx.getSystemInfo({
      success: function(res) {
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



    // 获取scrollview的margin-top
    const query = wx.createSelectorQuery();
    query.select('.tab-h').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        marginTop: res[0].bottom
      })
    })

    var typeCode = this.data.typeCode


    //获取接口数据

    this.getData()


  },


  
  //头图数据对接
  setTop:function(e){

    let title = e.data.result[0].title
    let date = e.data.result[0].date
    let source = e.data.result[0].source
    let img = e.data.result[0].firstImage
    let id = e.data.result[0].id

    if (img.slice(0,4) !== "http") {
      img = "http://"+img
    } else {
      img = img
    }
    
    const topTitle = "topNews.title"
    const topDate = "topNews.date"
    const topSource = "topNews.source"
    const topImg = "topNews.img"
    const topId = "topNews.id"

    this.setData({
      [topTitle]: title,
      [topDate]: date.slice(11, 16), 
      [topSource]: source,
      [topImg]: img,
      [topId]: id
    })

    

  },

  //列表数据对接
  setList(e){

    let newsList = e.data.result
    let list = []


    for (let i = 1; i < newsList.length; i += 1) {
      
      
      if (newsList[i].img !== "http") {
        newsList[i].img = "http://" + newsList[i].img
      } else {
        newsList[i].img = newsList[i].img
      }

      list.push({
        id: newsList[i].id,
        title: newsList[i].title,
        img: newsList[i].firstImage,
        date: newsList[i].date.slice(11,16),
        source: newsList[i].source
      })
    }

    this.setData({
      newsList:list
    })
  },

 

  // 下拉刷新 
  onPullDownRefresh() {
    this.getData(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    })
  },

  // 加载数据
  getData(callback){
   
    let tab = this.data.currentTab

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.typeCode[tab]
      },

      success: res => {
        this.setTop(res)
        this.setList(res)
        wx.hideLoading()
        this.getSwiperHeight()
      },

      complete: () => {
        callback && callback()
      }
    })
    
  },

  //swiper高度
  getSwiperHeight(){
    const listLength = this.data.newsList.length
    const cal = 422 + 188 * listLength

    this.setData({
      swiperHeight: cal
    })
  }

})