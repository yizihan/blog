;
(function($) {
  // 定义Carousel类
  var Carousel = function (poster) {  // 接收传入的jQuery对象
    this.poster = poster;
    this.posterItemMain = poster.find("ul.poster-list");
    this.prevBtn = poster.find("div.poster-prev-btn");
    this.nextBtn = poster.find("div.poster-next-btn");
    this.posterItems = this.posterItemMain.find("li");
    this.posterFirstItem = this.posterItemMain.find("li").eq(0);

    this.setting = {
      "width": 800,
      "height": 270,
      "posterWidth": 640,
      "posterHeight": 270,
      "verticalAlign": "middle",
      "scale": 0.9,
      "speed": 500
    };

    // 汇合配置
    $.extend(this.setting, this.getSetting());

    // 调用函数，设置参数数值
    this.setSettingValue();

    // 设置逐帧的关系
    this.setPosterPos();
  };

  // 定义prototype
  Carousel.prototype = {

    // 设置剩余的帧的位置关系
    setPosterPos: function () {
      var self = this;

      // 剩下所有的列表
      var sliceItems = this.posterItems.slice(1);
      var sliceSize = sliceItems.length / 2;
      // 右侧列表内容
      var rightSlice = sliceItems.slice(0, sliceSize);
      var leftSlice = sliceItems.slice(sliceSize);

      // 分层等级数
      var level = Math.floor(this.posterItems.length / 2);

      var rw = this.setting.posterWidth,    // 第一帧的宽度和高度
          rh = this.setting.posterHeight,
          // gap 每帧之间的间隙
          gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;

      var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
      var fixOffsetLeft = firstLeft + rw;

      // 设置右边逐帧的位置关系
      rightSlice.each(function (i) {
        level--;  // 每次遍历，更改层级level

        // 上一帧的宽度和高度*scale
        rw = rw * self.setting.scale;
        rh = rh * self.setting.scale;

        var j = i;

        $(this).css({
          zIndex: level,
          width: rw,
          height: rh,
          opacity: 1 / (++i),
          left: fixOffsetLeft + (++j) * gap - rw,
          top: (self.setting.height - rh) / 2
        })
      });

      // 设置左侧逐帧的位置关系
      var lw = rightSlice.last().width(),
          lh = rightSlice.last().height(),
          oloop = Math.floor(this.posterItems.length / 2);

      leftSlice.each(function () {
        $(this).css({
          zIndex: level,
          width: lw,
          height: lh,
          opacity: 1 / oloop,
          left: fixOffsetLeft + (++j) * gap - rw,
          top: (self.setting.height - rh) / 2
        });
        oloop--;
      })

    },

    // 使用配置参数去控制基本的宽度和高度
    setSettingValue: function () {
      // 为DOM元素设置设定好的值
      this.poster.css({
        width: this.setting.width,
        height: this.setting.height
      });

      this.posterItemMain.css({
        width: this.setting.width,
        height: this.setting.height
      });

      var w = (this.setting.width - this.setting.posterWidth) / 2;
      this.nextBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2)
      });

      this.prevBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2)
      });

      this.posterFirstItem.css({
        left: w,
        zIndex: Math.ceil(this.posterItems.length / 2)
      })

    },

    // 获取自定义配置
    getSetting: function () {
      var setting = this.poster.attr("data-setting");
      if(setting && setting !== " ") {
        return $.parseJSON(setting);
      }else {
        return {};
      }
    }

  };

  // 设置初始化方法，接受所有Class名的集合
  // 遍历集合，将每个元素执行new _this($(this)) === new Carousel($(this));
  // $(this)指向每个元素
  Carousel.init = function (posters) {
    var _this = this;
    posters.each(function() {
      new _this($(this));     // new出每一个实例
      // this === poster 每一个DOM节点
      // $(this) 改为jQuery对象
    });
  };
  
  // 全局注册
  window["Carousel"] = Carousel;
})(jQuery);