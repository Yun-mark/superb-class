$(function () {
  // fetch用的url
  __URL = '/Allspark/getList'
  var i = 0

  var $btn = $('.section-btn li'),
    $wrap = $('.section-wrap'),
    $arrow = $('.arrow'),
    $in = $('.in')

  /*当前页面赋值*/

  function up() {
    i++
    if (i == $btn.length) {
      i = $btn.length - 1
    }
  }

  function down() {
    i--
    if (i < 0) {
      i = 0
    }
  }

  var flag = 0
  // 大事记轮播图构建函数
  // 详情参考slick官网
  function slick(tplStone, tplLine) {
    $('.stone-con').html(tplStone)
    $('.line-con').html(tplLine)
    $('.stone-con').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: '.line-con',
      autoplay: true,
      infinite: false,
    })
    $('.line-con').slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      asNavFor: '.stone-con',
      arrows: false,
      centerMode: true,
      focusOnSelect: true,
      autoplay: true,
      infinite: false,
    })
    var lines = $('.line-con').find('.slick-slide')
    var index
    function change() {
      for (let i = 0; i < lines.length; i++) {
        if (
          $('.line-con').find('.slick-slide').eq(i).hasClass('slick-current')
        ) {
          index = i
        }
      }
      $('.line-con')
        .find('.slick-slide')
        .children('.line-son')
        .children()
        .eq(0)
        .removeClass('line-top-active')
      $('.line-con')
        .find('.slick-slide')
        .children('.line-son')
        .eq(index)
        .children()
        .eq(0)
        .addClass('line-top-active')
    }
    $('.stone-con,.line-con').on('swipe', change)
    $('.line-con').on('beforeChange', function (
      event,
      slick,
      currentSlide,
      nextSlide
    ) {
      $('.line-con')
        .find('.slick-slide')
        .children('.line-son')
        .eq(currentSlide)
        .children()
        .eq(0)
        .removeClass('line-top-active line-top-hover-active')
      $('.line-con')
        .find('.slick-slide')
        .children('.line-son')
        .eq(nextSlide)
        .children()
        .eq(0)
        .removeClass('line-top-hover-active')
        .addClass('line-top-active')
    })
    $('.section-2').one('mousewheel', function (e) {
      if (e.deltaY < 0) {
        change()
      }
    })
    $('.line-son').children().on('mouseenter', function () {
      if ($(this).hasClass('line-top-active')) {
        return
      } else {
        change()
        $(this).addClass('line-top-hover-active')
      }
    })
    $('.line-son').children().on('mouseleave', function () {
      change()
      $(this).removeClass('line-top-hover-active')
    })
  }

  function run() {
    $btn.eq(i).addClass('on').siblings().removeClass('on')

    $wrap
      .attr('class', 'section-wrap')
      .addClass(function () {
        return 'put-section-' + i
      })
      .find('.section')
      .eq(i)
      .find('.title')
      .addClass('active')
    setTimeout(function () {
      // 为箭头添加类名,有的地方多余了,不想改了
      if (i == 0) {
        $arrow.removeClass('in')
        $arrow.addClass('arrow')
        $arrow.addClass('arrowIndex')
      } else if (i == $btn.length - 2) {
        $arrow.removeClass('arrow')
        $arrow.removeClass('arrowIndex')
        $arrow.removeClass('in')
      } else if (i != $btn.length - 1 || i == 0) {
        $arrow.removeClass('in')
        $arrow.removeClass('arrowIndex')
        $arrow.addClass('arrow')

      } else {
        $arrow.removeClass('arrow')
        $arrow.removeClass('arrowIndex')
        $arrow.removeClass('in')
      }
    }, 100)

    if (i == $btn.length - 2) {
      // 控制背景的圆球
      $('.circular-up,.circular-up-cover').animate({
        top: '-100px'
      }, 1000)
      $('.circular-down,.circular-down-cover').animate({
        bottom: '-160px'
      }, 1000)

      if (!flag) {
        var tplStone
        var tplLine
        var dataStone = []
        var dataLine = []
        // 发送fetch请求
        fetch(__URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            return res.json()
          })
          .then((res) => {
            var listSorting = res 
            var listNumber = [] // 此时日期字符串格式变为数字
            var list = []
            for (let i = 0; i < listSorting.length; i++) {
              var dateNumberGetSum = 0 // 将日期字符串格式变为数字格式并将年月日求和，方便排序
              dateNumberGetSum += // 这里可以换成循环，但感觉没必要
              parseInt(listSorting[i].date.split('-')[0]) * Math.pow(10, 4) +
              parseInt(listSorting[i].date.split('-')[1]) * Math.pow(10, 2) +
              parseInt(listSorting[i].date.split('-')[2]) * Math.pow(10, 0)  // 年月日保证权重不一样，不然加起来可能相等
              listNumber.push({
                text: listSorting[i].text,
                date: listSorting[i].date,
                dateNumber: dateNumberGetSum
              })
            }
            for(let i = 0; i < listNumber.length - 1; i++) { // 冒泡排序
              for(let j = 0; j < listNumber.length - 1 - i; j++) {
                if (listNumber[j].dateNumber > listNumber[j+1].dateNumber) {
                  var temp = null
                  temp = listNumber[j]
                  listNumber[j] = listNumber[j+1]
                  listNumber[j+1] = temp
                }
              }
            }
            for(let i = 0; i < listNumber.length; i++) {
              list.push({
                text: listNumber[i].text,
                date: listNumber[i].date
              })
            }
            for (let i = 0; i < list.length; i++) {
              var date = []
              var dateString = list[i].date.split('-') // 将年月日分开
              for (let i = 0; i < dateString.length; i++) {
                date.push(parseInt(dateString[i]))
              }
              // 大图标数据
              dataStone.push({
                date,
                imgUrl: `./img/${list[i].date}/${list[i].date}1.jpg`,
                desc: list[i].text
              })
              // 小图标数据
              dataLine.push({
                date: list[i].date.split('-').join('.').substring(2),
                imgUrl: `./img/${list[i].date}/${list[i].date}2.jpg`
              })
            }
            // 建立大图标模板
            tplStone = template('tplStone', {
              dataStone
            })
            // 小图标模板
            tplLine = template('tplLine', {
              dataLine
            })
            // 传入生成轮播函数中
            slick(tplStone, tplLine)
          })
          .catch((err) => {
            if (err) {
              $('.stone-con').html('<div class="stone-error">ERROR</div>')
            }
          })
        flag = 1
      }
    }

    // 判断第三个页面

    if (i == $btn.length - 3) {
      var height = $(window).height()
      $('.circular-up,.circular-up-cover').animate({
        top: `${430 * height / 969}px`
      }, 900)
      $('.circular-down,.circular-down-cover').animate({
        bottom: `${430 * height / 969}px`
      }, 900)
    }
  }

  /*右侧按钮点击*/

  $btn.each(function (index) {
    $(this).click(function () {
      i = index

      run()
    })
  })

  /*翻页按钮点击*/

  $arrow.one('click', go)

  function go() {
    i++
    if (i == $btn.length - 1) {
      i = 0
    }
    run()
    setTimeout(function () {
      $arrow.one('click', go)
    }, 1000)
  }

  $in.on('click', function () {
    i = 0
    run()
    $wrap.attr('class', 'section-wrap').addClass(function () {
      return 'put-section-' + i
    })
  })

  /*响应鼠标*/

  $wrap.one('mousewheel', mouse_)

  function mouse_(event) {
    if (event.deltaY < 0) {
      up()
    } else {
      down()
    }

    run()

    setTimeout(function () {
      $wrap.one('mousewheel', mouse_)
    }, 1000)
  }

  /*响应键盘上下键*/

  $(document).one('keydown', k)

  function k(event) {
    var e = event || window.event

    var key = e.keyCode || e.which || e.charCode

    switch (key) {
      case 38:
        down()
        run()

        break

      case 40:
        up()
        run()

        break
    }

    setTimeout(function () {
      $(document).one('keydown', k)
    }, 1000)
  }
})
