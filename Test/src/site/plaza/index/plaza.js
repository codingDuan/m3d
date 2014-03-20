(function ($, undefined) {
  $(".album-cover-hook").albumCover();

  //首页翻滚模块
  /*_JCH_common/jch/jch_slider.coffee_text/coffeescript */
// Generated by CoffeeScript 1.6.3
var Slider;

Slider = (function() {
  function Slider(container, controls, time) {
    var items;
    if (time == null) {
      time = 250;
    }
    this.container = container;
    items = this.container.children();
    this.index = 0;
    this.count = items.length - 1;
    this.distance = items.width();
    this.time = time;
    this.initControl(controls);
  }

  Slider.prototype.initControl = function(parent) {
    var indicator, self;
    self = this;
    parent.find(".left-btn").on("click", function() {
      self.previous();
      return false;
    });
    parent.find(".right-btn").on("click", function() {
      self.next();
      return false;
    });
    indicator = parent.find('.page-index');
    if (indicator.length) {
      this.indicator = indicator;
      return parent.on("click", function(e) {
        var index;
        index = indicator.index(e.target);
        if (index !== -1) {
          self.jumpTo(index);
          self.showCurrentPos(index);
        }
        return false;
      });
    } else {
      return this.indicator = false;
    }
  };

  Slider.prototype.next = function() {
    if (++this.index > this.count) {
      this.index = 0;
    }
    this.right();
    return this.showCurrentPos(this.index);
  };

  Slider.prototype.previous = function() {
    if (--this.index < 0) {
      this.index = this.count;
    }
    this.left();
    return this.showCurrentPos(this.index);
  };

  Slider.prototype.showCurrentPos = function(i) {
    if (this.indicator !== false) {
      this.indicator.removeClass('page-active');
      return this.indicator.eq(i).addClass('page-active');
    }
  };

  Slider.prototype.right = function(target) {
    var self;
    ting.loadChildImages(this.container.children().eq(1));
    self = this;
    return this.container.animate({
      left: -this.distance
    }, this.time, function() {
      if (target) {
        target.before(self.container.children().eq(0).remove());
      } else {
        self.container.append(self.container.children().eq(0).remove());
      }
      return self.container.css("left", "0");
    });
  };

  Slider.prototype.left = function(fixCount) {
    var self;
    ting.loadChildImages(this.container.children().last());
    self = this;
    this.container.prepend(this.container.children().last().remove());
    this.container.css("left", -this.distance);
    return self.container.animate({
      left: 0
    }, this.time, function() {
      var afterHock;
      if (fixCount) {
        afterHock = self.container.children().first();
        while (fixCount-- > 0) {
          afterHock.after(self.container.children().last());
        }
      }
    });
  };

  Slider.prototype.jumpTo = function(target) {
    if (target === this.index) {

    } else if (target > this.index) {
      if (this.index + 1 === target) {
        this.right();
        return this.index++;
      } else {
        this.jumpRight(target - this.index - 1);
        return this.index = target;
      }
    } else {
      if (this.index - 1 === target) {
        this.left();
        return this.index--;
      } else {
        this.jumpLeft(this.index - target - 1);
        return this.index = target;
      }
    }
  };

  Slider.prototype.jumpRight = function(n) {
    var flagDOM;
    flagDOM = this.container.children().eq(1);
    while (n--) {
      this.container.append(this.container.children().eq(1).remove());
    }
    return this.right(flagDOM);
  };

  Slider.prototype.jumpLeft = function(n) {
    this.container.append(this.container.children().eq(this.count - n).remove());
    return this.left(n);
  };

  return Slider;

})();

ting.Slider = Slider;

var plazaSlider=new ting.Slider($('.new-album-list'), $('.newalbum-focus'));
/*_JCH_*/



  //音乐人模块统计
  $('.baidu-artist').on('click', function(e){
    if($(e.target).hasClass('js-log')){
      ting.logger.plogClick('play_baidu_artist');
    }
  });


  // 播放全部歌曲 (首页蓝色“播放榜单”按钮)
  //$('.play-all-hook').topPlayFun();
  $('.play-all-hook').click(function () {
    var type = $(this).data("type");
    var opt = {
      moduleName: type
    };
    ting.media.playTop(type, opt);
    $(this).tip().tip("tipup", {
      msg: "已开始播放",
      iconClass: "tip-success"
    });

    /* 点击统计 start by lutaining */
    if (ting && ting.logger && ting.logger.plogClick) {
      ting.logger.plogClick("play_all");
    }
    /* 点击统计 end by lutaining */

    //bdbrowser effect
    if (ting.browser.isSpecial()) {
      ting.browser.add2box('play');
    }

    return false;
  });


  //$(".ecom-ad").ecomad();


  $(".new-album .cover , .new-album .play-icon , .new-album .album-name , .new-album .singer-name .author_list").click(function () {
    var className = $(this).attr("class"),
      type = "",
      parent = $(this).parents("li");

    if (className.indexOf("cover") != -1) {
      type = "album_cover";
    } else if (className.indexOf("play-icon") != -1) {
      type = "play_button";
    } else if (className.indexOf("album-name") != -1) {
      type = "album_name";
    } else if (className.indexOf("author_list") != -1) {
      type = "singer";
    }
    var opt = {
      page: "home",
      pos: "newsongupdate",
      sub: "newAlbum",
      album: $(".album-name a", parent).attr("title"),
      star: $(".singer-name", parent).data("title"),
      clickname: type
    };
    ting.logger.log("click", opt);
  });





  // 播放器入口的渲染逻辑
  $(function () {
    var userTmpl = $('#play-entry-user-tmpl').html(),
      songsTmpl = $('#play-entry-songs-tmpl').html(),

      mbox = new singleInstance({
        bridge: 'bridge',
        path: '/player/'
      }),

      greeting = (function (h) {
        var r;

        if (h >= 6 && h < 9) {
          r = '早上好！';
        } else if (h >= 9 && h < 11) {
          r = '上午好！';
        } else if (h >= 11 && h < 14) {
          r = '中午好！';
        } else if (h >= 14 && h < 19) {
          r = '下午好！';
        } else {
          r = '晚上好！';
        }

        return r;
      }((new Date()).getHours())),

      $mod = $('.play-entry'),
      $songsTmpl,

      renderUser = function (r) {
        var pi = r.passInfo;
        $mod.html($(_.template(userTmpl)({
          vip: r.vip,
          avatar: $.isPlainObject(pi) && pi.avatar_small || '/static/images/default/user_default_40.png',
          name: r.name,
          greeting: greeting
        })));
      },

      renderSongs = function (r) {
        $songsTmpl = $(_.template(songsTmpl)(r));
        $mod.append($songsTmpl);
        if (r.isLogin) {
          $('<p>我的收藏: <a class="collection" href="javascript:;">' + r.cloud + '</a>首</p>').appendTo($mod.find('.collect-info'));
        }else{
          // vip info
          $mod.find('.collect-info').remove();
          $mod.find('.info').addClass('nologin');
          $('.vip-privilege-info').html('<a href="http://music.baidu.com/home/payment/cloud?type=add&level=comm&pst=pay_plaza" target="_blank">开通VIP会员</a>，享受精彩特权');
          $('.vip-privilege').addClass('gold');
        }
        $mod.show();
      },

      render = function (r) {
        var user = r.user,
          songs = r.songs,
          fn = r.methodName || 'mboxCtrl.playLocal',
          openBox = function () {
            var args = [].slice.call(arguments);

            ting.logger.log('click', {
              pos: 'home_box'
            });

            $(args[0].target).tip().tip('tipup', {
              msg: '已开始播放',
              iconClass: 'tip-success'
            });

            args.push({
              moduleName: 'playEntry'
            });

            mbox.openBox.apply(mbox, args.slice(1));
          };

        if (songs && songs.length) {
          user.name = user.bdName || user.userName || '';
          r.isLogin = !_.isEmpty(user.name);

          renderUser(user);
          renderSongs(r);

          ting.logger.log('exposure', {
            page: 'home_box',
            expoitem: songs.length
          });

          $mod.find('.js-play').hover(function () {
            $(this).addClass('on');
          }, function () {
            $(this).removeClass('on');
          });

          $mod.find('.login').click(function () {
            ting.passport.checkLogin(function () {
            }, function () {
            }, function () {
            }, function () {
            });
            return false;
          });

          $mod.on('click', '.js-play', function (e) {
            var i = $(this).data('index');
            openBox(e, fn, [i]);
          });

          $mod.find('.more').click(function (e) {
            openBox(e, fn, null);
          });

          $mod.find('.collection').click(function (e) {
            openBox(e, 'mboxCtrl.playCollection', null);
          });
        } else {
          ting.logger.log('exposure', {
            page: 'home_box',
            expoitem: '0'
          });
        }
      };

    window._command = function (data) {
      data = JSON.parse(data);

      if (ting.userInfo) {
        render((data.user = ting.userInfo, data));
        try {
          var id = ting.userInfo.vip.cloud.service_level;
          $('.vip-privilege').addClass(id);
        }catch (e){
        }
      } else {
        $.getJSON('/data/user/info?callback=?', function (r) {
          render((data.user = r.data, data));
          try {
            var id = r.data.vip.cloud.service_level;
            $('.vip-privilege').addClass(id);
          }catch (e){
          }
        });
      }
    };

    $(document).on('logined', function () {
      window.location.href = window.location.href;
    });

    /* 请勿将pe.play.baidu.com改为play.baidu.com, 以方便在开发环境下测试 首页音乐盒入口，配下host就行 */
    $('<iframe src="javascript:;" tabindex="-1" width="1" height="1" style="position: absolute; top: -5px; left: 0;" />')
      .appendTo('body').attr('src', 'http://pe.play.baidu.com/webentrence');
  });

    var focusHook = $('.focus-hook'),
        focusNav = focusHook.find('.focus-page'),
        focusPlay = focusHook.find('.focus-play'),
        focusCover = focusHook.find('.focus-cover li'),

        setFocusPlay = function($li) {
            var songIds = $li.data('song');
            if (songIds) {
                focusPlay.data('song', songIds).show();
                focusPlay.data('module', $li.data('module')).show();
            } else {
                focusPlay.hide();
            }
        };
    focusHook.find(".list li>a").on("click",function  () {
      ting.logger.log("click",{"page":ting.logger.getPage(), "pos":"jdt","sub":$(this).data('stats')});
    });
    focusPlay.on("click",function  () {
        var ids=$(this).data("song")+"",
            moduleName=$(this).data("module");
        if(ids){
            ids=ids.split(",");
            ting.media.playSong(ids,{moduleName:moduleName,type:"song"});
        }
        return false;
    });

    focusHook.anyfocus({
        effect: 'slide',
        interTime: 5000,
        callback: function() {
            focusNav.show();
            setFocusPlay(focusCover.eq(0));
        }
    }).bind('anyfocus.runafter', function(e,obj) {
            $(".page-active",focusNav).removeClass("page-active");
            $(".page-index",focusNav).eq(obj.index).addClass("page-active");
            setFocusPlay(focusCover.eq(obj.index));
        });

    var arrowp = focusHook.find('.arrowp');
    focusHook.on('mouseenter', function() {
        arrowp.show().stop().animate({
            opacity: 1
        });
    });
    focusHook.on('mouseleave', function() {
        arrowp.stop(true).animate({
            opacity: 0
        }, function() {
            arrowp.hide();
        });
    });


    $(".page-index" , focusNav).bind('click',function(e){
        if( $(this).hasClass("page-active")){
            return false;
        }
        var index=$(this).parent().index();

        $("#focus-hook").anyfocus("stop").anyfocus("switchTo",index);

        return false;
    });


})(jQuery);

// 首页广告相关 wangyu 20130904
var admConfig = {
  //商业广告
  '554986': 'adm-main-left'
  ,'727409': 'adm-main-right' //预加载
  ,'554757': 'adm-bottom'
  //活动广告
  ,'652790': 'adm-new-album'
  ,'476522': 'adm-head-right' //直接加载图片
  ,'434561': 'adm-main-right-two'
};

$(window).load(function(){
  for(var key in admConfig){
    if (admConfig.hasOwnProperty(key)){
      BAIDU_CLB_fillSlotAsync(key, admConfig[key]);
    }
  }
});


//异步加载首页模块 wangyu 20130910
/*_JCH_common/jch/jch_async_module.coffee_text/coffeescript */
// Generated by CoffeeScript 1.6.3
(function() {
  var $win, loadModule, modules;
  modules = $('.async-module');
  $win = $(window);
  loadModule = function(preDistance) {
    var index, obj, _i, _len, _obj;
    if (preDistance == null) {
      preDistance = 0;
    }
    for (index = _i = 0, _len = modules.length; _i < _len; index = ++_i) {
      _obj = modules[index];
      obj = modules.eq(index);
      if (obj.offset().top < ($win.scrollTop() + $win.height() + preDistance)) {
        obj.loadModule(obj.data('load-module'));
        if (index === modules.length - 1) {
          modules = modules.slice(index + 1);
        }
      } else {
        if (index > 0) {
          modules = modules.slice(index);
        }
        break;
      }
    }
  };
  $win.on('scroll', function() {
    clearTimeout(arguments.callee.tid);
    return arguments.callee.tid = setTimeout(function() {
      return loadModule($win.height() / 2);
    }, 50);
  });
  $win.on('load', function() {
    return loadModule();
  });
})();
/*_JCH_*/
$(function  () {
  $('#ww').focus();
})