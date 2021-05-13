(function($) {
  var defaults = {
    'container': '#container', //容器
    'sections': '.section', //子容器
    'easing': 'ease', //特效方式，ease-in,ease-out,linear
    'duration': 1000, //每次动画执行的时间
    'pagination': true, //是否显示分页
    'loop': false, //是否循环
    'keyboard': true, //是否支持键盘
    'direction': 'vertical', //滑动的方向 horizontal,vertical,
    'onpageSwitch': function(pagenum) {}
  };
  var win = $(window);
  var iIndex = 0; //当前section的索引
  var arrElement = [];
  var canScroll = true;
  var container;
  var sections;
  var opts;

  var SP = $.fn.switchPage = function(options) {
    opts = $.extend({}, defaults, options || {});
    container = $(opts.container);
    sections = container.find(opts.sections);
    sections.each(function() {
      arrElement.push($(this));
    });
    return this.each(function() {
      if (opts.direction == 'horizontal') initLayout();
      if (opts.pagination) initPagination();
    })

  }
  //重置鼠标滚轮事件
  $(document).on("mousewheel DOMMouseScroll", MouseWheelHandler);
  function MouseWheelHandler(e) {
    e.preventDefault();
    var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
    var delta = Math.max(-1, Math.min(1, value));
    if (canScroll) {
      if (delta < 0) {
        SP.moveSectionDown();
      } else {
        SP.moveSectionUp();
      }
    }
    return false;
  }

  //向上一张移
  SP.moveSectionUp = function() {
    if (iIndex) {
      iIndex--;
    } else if (opts.loop) {
      iIndex = arrElement.length - 1;
    }
    scrollPage(arrElement[iIndex]);
  }

  //向下一张移
  SP.moveSectionDown = function() {
    if (iIndex < (arrElement.length - 1)) {
      iIndex++
    } else if (opts.loop) {
      iIndex = 0;
    }
    scrollPage(arrElement[iIndex]);
  }

  //当设置横向移动时初始化横向页面
  function initLayout() {
    var width = (sections.length * 100) + '%',
      cellwidth = (100 / sections.length).toFixed(2) + '%';
    // container.width(width).addClass('left');
    container.width(width);
    sections.width(cellwidth).addClass('left');
  }

  //移动页面
  function scrollPage(element) {
    var dest = element.position();
    if (dest == void 0) return;
    initEffects(dest, element);
  }

  //导航条初始化
  function initPagination() {
    var length = sections.length;
    var pageHtml = '<ul id="pages"><li class="active"></li>'
    for (var i = 1; i < length; i++) pageHtml += '<li></li>';
    pageHtml += '</ul>';
    $("body").append(pageHtml);
  }

  function isSupportCss(property) {
    var body = $('body')[0];
    for (var i = 0; i < property.length; i++) {
      if (property[i] in body.style) {
        return true;
      }
    }
    return false;
  }

  //移动页面的核心函数
  function initEffects(dest, element) {
    canScroll = false;
    var translate = "";
    if (opts.direction == 'horizontal') {
      translate = '-' + dest.left + 'px, 0px, 0px';
    } else {
      translate = '0px, -' + dest.top + 'px, 0px';
    }
    container.css({
      'transform': "translate3d(" + translate + ")",
      'transition': "all " + opts.duration + "ms " + opts.easing
    });
    container.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend", function() {
      canScroll = true;
    });
    element.addClass("active").siblings().removeClass('active');
    if (opts.pagination) {
      paginationHandler();
    }
  }

  //每次页面移动时，修改导航栏
  function paginationHandler() {
    var pages = $('#pages li');
    pages.eq(iIndex).addClass('active').siblings().removeClass('active');
  }

  var resizeId;
  win.resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(function(){
      rebuild();
    }, 500);
  });

  function rebuild() {
    var currentHeight = win.height();
    var currentWidth = win.width();
    var element = arrElement[iIndex];
    if(opts.direction == "horizontal") {
      var offsetLeft = element.offset().left;
      if (Math.abs(offsetLeft) > (currentWidth/2) && iIndex < (arrElement.length - 1)){
        iIndex++
      }
    }else {
      var offsetTop = element.offset().top;
      if (Math.abs(offsetTop) > (currentHeight/2) && iIndex < (arrElement.length - 1)){
        iIndex++
      }
    }
    var currentElement = arrElement[iIndex],
    dest = currentElement.position();
    initEffects(dest, currentElement);
    if(opts.pagination) paginationHandler();
  }
  
})(jQuery);
