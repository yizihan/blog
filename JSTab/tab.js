;
(function ($) {
  var Tab = function (tab) {
    var _this = this;
    this.tab = tab;

    // 默认配置参数
    this.config = {
      // 触发类型
      "triggerType": "mouseover",
      // 过渡效果
      "effect": "default",
      // 默认显示第几个
      "invoke": 1,
      // 定义tab是否自动切换，当指定了时间间隔，就表示自动切换，并且切换时间为指定的时间间隔
      "auto": false
    };

    // 如果配置参数存在，就扩展默认的配置参数
    if (this.getConfig()) { // 获取用户定义参数
      $.extend(this.config, this.getConfig());
    }

    // 保存tab标签列表、对应的内容列表
    this.tabItems = this.tab.find("ul.tab-nav li");
    this.contentItems = this.tab.find(".content-wrap .content-item");

    // 判断触发
    var type = this.config.triggerType;
    if (type === "click") {
      this.tabItems.on(type, function () {
        _this.invoke($(this));
      });
    } else if (type === "mouseover" || type !== "click") {
      this.tabItems.mouseover(function () {
        _this.invoke($(this));
      })
    }

    // 判断是否自动播放
    if (this.config.auto) {
      // 定义一个全局定时器
      this.timer = null;

      // 定义计数器
      this.loop = 0;

      this.autoPlay();

      this.tab.hover(function () {
        window.clearInterval(_this.timer);
      }, function () {
        _this.autoPlay();
      })
    }

    // 设置默认显示第几个tab
    if (this.config.invoke > 1) {
      this.invoke(this.tabItems.eq(this.config.invoke - 1));
    }

  };

  Tab.prototype = {
    // 自动间隔时间切换
    autoPlay: function () {
      var _this = this,
        tabItems = this.tabItems,
        tabLength = tabItems.size(),
        config = this.config;

      this.timer = window.setInterval(function () {
        _this.loop++;
        if (_this.loop >= tabLength) {
          _this.loop = 0;
        }
        // 设置相应的tabItems触发事件
        tabItems.eq(_this.loop).trigger(config.triggerType);
      }, config.auto);
    },


    // 获取用户自定义配置
    getConfig: function () {
      var config = this.tab.attr("data-config");
      if (config && config !== " ") {
        return JSON.parse(config);
      } else {
        return null;
      }
    },

    // 事件驱动函数
    invoke: function (currentTab) {
      var _this = this;
      // 当前tabItem的索引值
      var index = currentTab.index();
      currentTab.addClass("actived").siblings().removeClass("actived");

      // 获取conItems
      var conItems = this.contentItems;

      // 获取过渡效果设置
      var effect = this.config.effect;
      if (effect === "default" || effect !== "fade") {
        conItems.eq(index).addClass("current").siblings().removeClass("current");
      } else if (effect === "fade") {
        conItems.eq(index).fadeIn().siblings().fadeOut();
      }

      // 当用户自己触发时，将当前的loop的值设置成当前tab的index
      if (this.config.auto) {
        this.loop = index;
      }
    }

  };
  Tab.init = function (tabs) {
    var _this = this;
    tabs.each(function () { // 每一个都new一个实例
      new _this($(this)); // 并将本身传参进去
    })
  };

  // 注册成jQuery方法
  $.fn.extend({
    tab: function () {
      this.each(function () {
        new Tab($(this));
      })
    }
  });
  window.Tab = Tab;
})(jQuery);