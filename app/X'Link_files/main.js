//基于zepto 1.1.6 添加touch模块 &iscroll5
var alive = {};

var codeid=document.getElementById("codeid").value;//6003
var userid=document.getElementById("userid").value;//47
var openid=document.getElementById("openid").value;//123456

var htmlflg=document.getElementById("htmlFlg").value;//页面标识
var sceneID=document.getElementById("sceID").value;//场景ID
var secID=document.getElementById("secID").value;//二级页面ID

var gzhflag=document.getElementById("gzhflag").value;

var fadeSta = "0";//按钮自主学习时 学习框状态 0为未出现 1为出现
var learnSta = "0";
var errorInfo=document.getElementById("errorinfo").value;//0 loading 1 未授权 2 未绑定
var showFlg=document.getElementById("showFlg").value;//管理页 页面显示标识 0 输入密码 1 设置初始密码
var isURL=document.getElementById("isURL").value;
//console.log("codeid:"+codeid+",userid:"+userid+",openid: "+openid+", htmlflg:"+htmlflg+", sceneID:"+sceneID+", secID:"+secID+", fadeSta:"+fadeSta+", errorInfo:"+errorInfo+", showFlg:"+showFlg);
//欢迎页
alive.welecomeInfo =function(){
	if(errorInfo=="0"){
		$(".errorinfo").html("LOADING...");
		setTimeout(function () {
			window.location.href="/smartHome_1/goHome/"+gzhflag+"-"+userid+"-"+openid;
        }, 1000);
	} else if(errorInfo=="1"){
		$(".errorinfo").html("未授权:请等待管理员授权!");
	} else if(errorInfo=="2"){
		$(".errorinfo").html("未绑定:请先扫描设备上的二维码绑定主机!");
	} 

	//显示输入密码或者设置初始密码
	if(showFlg==0){
		if(isURL == 1){
			//输入密码
			$("#EQP_2").css("display","block");
		}else if(isURL == 0){
			//操作
			$("#EQP_5").css("display","block");
		}
	}else if(showFlg==1){
		//初始密码
		$("#EQP_1").css("display","block");
	}
};

//tools
alive.tools = {};

//IScroll初始化
var myScroll;
alive.tools.loadedScroll = function () {
	if ($('#wrapper').length > 0) {
		//console.log('找到一个wrapper');
		
		//初始化wrapper高度
		var winHeight = $(window).height();
		$('#wrapper').css('height', winHeight);

		myScroll = new IScroll('#wrapper', {
			bounce: false,
            probeType: false
		});
	} else {
		//console.log('没找到wrapper');
	}
};

//IScroll重新测定
alive.tools.rewriteScroll = function () {
	myScroll.destroy();
	myScroll = null;
	alive.tools.loadedScroll();
};

//事件初始化
alive.tools.setDefault = function () {
	document.addEventListener('touchstart', function (e) {
		e.preventDefault();
	}, {
    passive: false
  });
	document.addEventListener('touchmove', function (e) {
		e.preventDefault();
	},{
    passive: false
  });
	document.oncontextmenu = function (e) {
		window.event.returnValue = false;
		e.preventDefault();
		return false;
	};
};

//触碰动效模拟(默认touch_active类)
alive.tools.touchActive = function (object,cls,targetObj) {
    cls = typeof(cls) == 'undefined' ? 'touch_active' : cls;

    var fakeActive = function(el){

      el.addClass(cls);

      setTimeout(function () {
        el.removeClass(cls);
      }, 200);

    };

    if (typeof(targetObj) == 'undefined') {
      object.each(function () {
        $(this).on('tap', function () {
          fakeActive($(this));
        });
      });
    } else {
      object.each(function () {
        $(this).on('tap', function () {
          fakeActive(targetObj);
        });

      });
    }
};

//ui
alive.ui = {};
//遮罩&弹出层
alive.ui.mask = {};
var oMask = $('body>mask');
if ( oMask.length > 0 ) {
    //console.log('发现遮罩层');

    //显示遮罩层
    alive.ui.mask.showMask = function (zHeight) {
    	//console.log('显示遮罩层');
        zHeight = typeof(zHeight) == 'undefined' ? 20 : zHeight; 
        oMask.show();
        oMask.css('z-index', zHeight ) ;
        oMask.addClass('mask_show');
    };

    //隐藏遮罩层
    alive.ui.mask.hideMask = function () {
    	//console.log('隐藏遮罩层');
        oMask.removeClass('mask_show');
        setTimeout(function () {
            oMask.hide();
        }, 200);
        
    };
    
    var aPopup = $('div.popup');
    if ( aPopup.length > 0 ){
        //console.log('本页面有'+aPopup.length+'个弹出窗口');
        
        var aPopupSections = $('div.popup>section');
        
        //初始化弹出窗口的位置
        alive.ui.initializePopup = function (obj) {
            var oPopupSection = obj.children('section');
            var nHeight = oPopupSection.height() ;
            //console.log('弹出窗口高度为'+nHeight);
            oPopupSection.css( 'margin-top' , parseInt(-nHeight / 2));
        };
        
        //显示弹出层
        alive.ui.showPopup = function (obj, maskHeight, popupHeight){
            if ( typeof(popupHeight) !== 'undefined' ){
                obj.css('z-index', popupHeight );
            }
            alive.ui.mask.showMask(maskHeight);
            obj.show();
            alive.ui.initializePopup(obj);
            obj.addClass('popup_show');
        };
        
        //隐藏弹出层
        alive.ui.hidePopup = function (obj) {
            obj.removeClass('popup_show');
            setTimeout(function () {
                obj.hide();
            }, 200);
            // hideMask() delete
        };
        
        //绑定隐藏弹出层事件
        alive.ui.hidePopup.binding = function () {
            //阻止冒泡
            aPopupSections.on('tap', function (e) {
                e.stopPropagation();
            });
            
            //点击弹出层外围隐藏弹出层
            aPopup.on('tap', function (e) {
            	e.stopPropagation();
                alive.ui.hidePopup($(this));
                if(htmlflg == "TV" || htmlflg == "DVB" || htmlflg == "ARC" ){//如果是电视/机顶盒/空调页时
                	if($("#MoreBtnFlg").val() == "1" && this.id != "popup_moreBtn"){//2016 2 17 更多按钮 弹出层显示时 其余弹出层
    					alive.ui.mask.showMask(20);
    					return;
    				}
            		if($("#NumFlg").val() == "1" && this.id != "popup_redNum"){//2016 2 17 数字按钮弹出层显示时 其余弹出层
    					alive.ui.mask.showMask(20);
    					return;
    				}
            		$("#MoreBtnFlg").val("0");
            		$("#NumFlg").val("0");
            		fadeSta = "0";//状态为未弹起
            		clearTimeout(timeOut);//清空定时器
                }
                alive.ui.mask.hideMask();//add
            });
            
            //点击取消按钮隐藏弹出层
            $('div.popup>section a.popup_cancel').on('tap', function () {
                //这边可能有问题，目前还没碰到，碰到再解决
                alive.ui.hidePopup(aPopup);
                alive.ui.mask.hideMask();//add
            });
        }();
        
        //提示层一秒后隐藏
        alive.ui.popupShowHide = function() {
        	alive.ui.showPopup($("div#popup_alert"));
        	setTimeout(function(){
        		alive.ui.hidePopup($("div#popup_alert"));
        		alive.ui.mask.hideMask();
        	},1000);
        };
        
        //等待时的提示框
        alive.ui.waitAlert = function(htmlValue){
        	$('.alertMsg').html(htmlValue);
        	alive.ui.showPopup($("div#popup_alert"));
        };
    }
}

//页面图标初始化
alive.ui.indexInfo = function(){
	/* 添加设备标签 初始化图标 */
	var ctrlpic = document.getElementsByName("ctrlPic");
	var ctrlname = document.getElementsByName("ctrlName");
	for(var i=0;i<ctrlpic.length;i++){ 
		var ctrlpicVal = ctrlpic[i].id;
		var ctrlnameVal = ctrlname[i].id;
		var ctrlPic=document.getElementById(ctrlpicVal).value;
		var ctrlName=document.getElementById(ctrlnameVal).value;
		$("."+ctrlpicVal).html("<svg class='icon-86-blue'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#"+ ctrlPic +"'></use></svg><name>添加"+ctrlName+"控制</name>");
		$(".rightIco").html("<svg class='icon-70-lightgray'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#icon_right'></use></svg>");
	}
	
	/* 智能场景 初始化图标 */
	var scenepic = document.getElementsByName("scenePic");
	var scenename = document.getElementsByName("sceneName");
	for(var i=0;i<scenepic.length;i++){ 
		var scenepicVal = scenepic[i].id;
		var scenenameVal = scenename[i].id;
		var scenePic=document.getElementById(scenepicVal).value;
		var sceneName=document.getElementById(scenenameVal).value;
		$("."+scenepicVal).html("<svg class='icon-86-blue'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#"+ scenePic +"'></use></svg><name>"+sceneName+"</name>");
		$(".sceneDelete").html("<svg class='icon-46-darkgray'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#icon_del'></use></svg><span>删除</span>");
//		$(".edit_scene").html("<svg class='icon-46-darkgray'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#icon_edit'></use></svg><span>编辑</span>");
	}
	/* 我的设备 */
	var equpic = document.getElementsByName("equPic");
	var equname = document.getElementsByName("equName");
	for(var i=0;i<equpic.length;i++){ 
		var equpicVal = equpic[i].id;
		var equnameVal = equname[i].id;
		var equPic=document.getElementById(equpicVal).value;
		var equName=document.getElementById(equnameVal).value;
		$("."+equpicVal).html("<svg class='icon-86-blue'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#"+ equPic +"'></use></svg><name>"+equName+"</name>");
		$(".equDel").html("<svg class='icon-46-darkgray'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#icon_del'></use></svg><span>删除</span>");
	}
};

//我的设备标签初始化
_initialize = function(obj){
	var lightPanel=$("#light li");
	var socketPanel=$("#socket li");
	var wallSocketPanel=$("#wallsocket li");
	var curtainsPanel=$("#curtain li");
	var windowPanel=$("#window li");
	var redPanel=$("#telecontrol li");
	var safePanel=$("#security li");
	var manipulatorPanel=$("#manipulator li");
	var allLength=lightPanel.length + socketPanel.length + wallSocketPanel.length + curtainsPanel.length + windowPanel.length + redPanel.length + safePanel.length + manipulatorPanel.length;
	/* 显示状态 */
	if(lightPanel.length <= 0){
		$("#light").hide();	//灯
	}
	if(socketPanel.length <= 0){
		$("#socket").hide();//插座
	}
	if(wallSocketPanel.length <= 0){
		$("#wallsocket").hide();//墙面插座
	}
	if(curtainsPanel.length <= 0){
		$("#curtain").hide();//窗帘
	}
	if(windowPanel.length <= 0){
		$("#window").hide();//开窗器
	}
	if(redPanel.length <= 0){
		$("#telecontrol").hide();//红外
	}
	if(safePanel.length <= 0){
		$("#security").hide();//安防
	}
	if(manipulatorPanel.length <= 0){
		$("#manipulator").hide();//机械手
	}
	if(allLength <= 0){
		$("#promp").show();	//设备为空时的提示语
	}
	alive.tools.rewriteScroll();//重新计算滑动的高度
};

//初始化各个标签 
alive.ui.initializeIndex = function () {
	//初始化btn_out_hover隐藏
	var aBtnOutHover = $('.btn_out_hover');
	var aBtnHoverAllow = $('.btn_hover_allow');
	var aBtnOutDefault = $('.btn_out_default');
	var aTelecontrolIcon = $('section#telecontrol ul icon');
	var sceneRight = $('.scene_li_right');
	var aBtnOutAllow = $('.btn_out_allow');
	aBtnOutHover.hide();
	aBtnHoverAllow.hide();
	aBtnOutDefault.show();
	aTelecontrolIcon.show();
	sceneRight.show();
	aBtnOutAllow.show();
	//去除active
	$('.content section li.active').each(function () {
		$(this).removeClass('active');
	});
};

//初始化输入框tap事件获得焦点  
alive.ui.tapInputFocus = function () {
	var aInputBox = $('input');
	
	//离开input失去焦点
	$('html').on('touchstart', function () {
		aInputBox.blur();
	});
	
	//绑定tap获取焦点
	aInputBox.each(function () {
		this.addEventListener('touchstart',function(e){
			e.stopPropagation();
			this.focus();
		});
	});
};

//按钮的默认触碰效果
alive.ui.touchBtnDefault = function () {
    var sDistinguishBtn = '';
    var aBtnDefault = $('a.btn_default');
    var oBtnHeaderClose = $('a.btn_header_close');
    var oTvSelectGroup = $('#tv_select_group path#svg_tv_select_inside');
    var oTvSelectUp = $('#tv_select_group .tv_sctUp');
    var oTvSelectLeft = $('#tv_select_group .tv_sctLeft');
    var oTvSelectDown = $('#tv_select_group .tv_sctDown');
    var oTvSelectRight = $('#tv_select_group .tv_sctRight');
    var aAddPageSkipBtn = $('.add_page_section a.add_skip_btn');
    var aEqpPageSkipBtn = $('.EQP_section a.EQP_btn');//管理页
    var aPopupInsideBtn = $('.popup>section a');
    var oBtnHeaderOpen = $('a.btn_header_go');//开启场景
    var oBtnHeaderTime = $('a.btn_header_time');//定时
    
    //绑定按钮的默认触碰效果
    alive.ui.touchBtnDefault.rigging = function (object,cls,targetObj) {
        
        //辨别按钮
        alive.ui.touchBtnDefault.distinguish = function () {
            switch (object) {
                case aBtnDefault :
                    sDistinguishBtn = '默认样式按钮';
                break;
                case oBtnHeaderClose :
                    sDistinguishBtn = '遥控顶部开关按钮';
                break;
                case oTvSelectUp :
                case oTvSelectLeft :
                case oTvSelectDown :
                case oTvSelectRight :
                    sDistinguishBtn = '电视选择按钮组';
                break;
                case aAddPageSkipBtn :
                	sDistinguishBtn = '添加设备页面跳转按钮';
            	break;
                case aEqpPageSkipBtn :
                	sDistinguishBtn = '添加管理页面跳转按钮';
            	break;
                case aPopupInsideBtn :
                    sDistinguishBtn = '弹出层内部按钮';
                break;
                case oBtnHeaderOpen :
                	sDistinguishBtn = '场景页上开启按钮';
            	break;
                case oBtnHeaderTime :
                    sDistinguishBtn = '场景页上定时按钮';
                break;
            }
        };
        
        if ( object.length > 0 ) {
            alive.ui.touchBtnDefault.distinguish();
            //console.log('找到'+object.length+'个'+sDistinguishBtn);
            alive.tools.touchActive(object,cls,targetObj);
        }else{
            alive.ui.touchBtnDefault.distinguish();
            //console.log('没找到'+sDistinguishBtn);
        }
    };
    
    //默认样式的按钮
    alive.ui.touchBtnDefault.rigging(aBtnDefault);
    
    alive.ui.touchBtnDefault.rigging(oBtnHeaderOpen);// 开启 场景
    alive.ui.touchBtnDefault.rigging(oBtnHeaderTime);// 定时按钮
    
    //红外遥控开关按钮
    alive.ui.touchBtnDefault.rigging(oBtnHeaderClose);

    //电视选择按键组UI
    alive.ui.touchBtnDefault.rigging(oTvSelectUp,'touch_up_active',oTvSelectGroup);
    alive.ui.touchBtnDefault.rigging(oTvSelectLeft,'touch_left_active',oTvSelectGroup);
    alive.ui.touchBtnDefault.rigging(oTvSelectDown,'touch_down_active',oTvSelectGroup);
    alive.ui.touchBtnDefault.rigging(oTvSelectRight,'touch_right_active',oTvSelectGroup);
    
    //添加设备页面/管理页面按键
    alive.ui.touchBtnDefault.rigging(aAddPageSkipBtn);
    alive.ui.touchBtnDefault.rigging(aEqpPageSkipBtn);
    
    //弹出层按钮
    alive.ui.touchBtnDefault.rigging(aPopupInsideBtn);
};

//页面input框值至为空  错误提示隐藏 2015 12 1    管理页
alive.ui.inputValTestAlertNone = function (){
	var inputVal = $('div.content>section>input');
	var testAlert = $('section>div.testAlert');
	inputVal.val("");
	testAlert.hide();
};

//内页返回主页按钮UI
alive.ui.asideBackHome = function () {
    var oBackHome = $('header aside a#aside_backHome');
    if ( oBackHome.length > 0 ) {
        //console.log('找到一个返回主页按钮'); 
        alive.tools.touchActive(oBackHome);
        if(sceneID == null || sceneID == "" || htmlflg == "scene"){
        	$("#goIndex").html("返回主页");
        	oBackHome.on('tap', function () {
                window.location.href="/smartHome_1/goHome/"+gzhflag+"-"+userid+"-"+openid;
            });
        }else if(sceneID != null || sceneID != ""){
        	$("#goIndex").html("返回场景");
        	$("#szContentDel").hide();
        	if(htmlflg == "warning"){
        		$("#szContentControl").hide();
        		$("#is_manipulator").hide();
        	}
        	oBackHome.on('tap', function () {
                window.location.href="/smartHome_1/sceneCont/"+sceneID+"-"+codeid+"-"+openid+"-"+userid;
            });
        }
    }
};

//内页设置按钮UI
alive.ui.asideSet = function (){
	var oAsideSet = $('header aside a#aside_set');
    if ( oAsideSet.length > 0 ) {
        //console.log('找到一个设置按钮'); 
        
        var oAsideSetSection = oAsideSet.parents('section.aside_set_wrap');
        var oAsideSetMenu = $('header aside>section>ul.aside_set_menu');
        var oAsideSetMenuList = $('aside>section>ul.aside_set_menu a');
        
        //阻止设置按钮冒泡
        oAsideSetSection.on('tap', function (e) {
            e.stopPropagation();
        });
        
        //展开设置菜单
        oAsideSet.on('tap', function () {
        	if ( oAsideSet.hasClass('touch_active') ){
                return false;
            }else{
            	alive.ui.mask.showMask(5);
            	oAsideSetMenu.show();
                oAsideSet.addClass('touch_active');
                oAsideSetMenu.addClass('menuInDown');
                $('header aside a#aside_set>svg').attr("class","icon-56-blue");
            }
        });
        
      //收起菜单方法
        alive.ui.asideSet.menuInDown = function (){
            if ( oAsideSet.hasClass('touch_active') ){
                oAsideSet.removeClass('touch_active');
                oAsideSetMenu.removeClass('menuInDown');
                oAsideSetMenu.addClass('menuOutUp');
                $('header aside a#aside_set>svg').attr("class","icon-56-lightblue");
                setTimeout(function(){
                    oAsideSetMenu.removeClass('menuOutUp');
                    oAsideSetMenu.hide();
                },200);
            }else{
                return false;
            }
        };
        
        $('body').on('tap', function () {
        	//console.log('body点击');
        	alive.ui.mask.hideMask();
            alive.ui.asideSet.menuInDown();
        });
        
        if ( oAsideSetMenuList.length > 0 ){
        	//console.log('找到'+oAsideSetMenuList.length+'设置菜单条目');
            alive.tools.touchActive(oAsideSetMenuList);
            $(oAsideSetMenuList).on('tap', function () {
                alive.ui.asideSet.menuInDown();
            });
        } 
        /* 菜单内容 */
        var oAsideSetAmendPic = $('aside>section a#szContentPic');//图
        var oAsideSetAmendName = $('aside>section a#szContentName');//名
        var oAsideSetBinding = $('aside>section a#szContentBinding');//绑定
        var oAsideSetReBinding = $('aside>section a#szContentRemoveBinding');//解除绑定
        var oAsideSetChange = $('aside>section a#szContentChange');//开关交换
        var oAsideSetDel = $('aside>section a#szContentDel');//删除
        var oAsideSetVoid = $('aside>section a#szContentVoid');//语音 场景中
        var oAsideSetLearn = $('aside>section a#szContentLearn');//射频学习 场景中
        var oAsideMachineControl = $('aside>section a#szContentControl');//添加机械手  安防页面中
        var oAsideSetTime = $('aside>section a#szContentSetTime');//红外幕帘定时
        oAsideSetAmendPic.on('tap', function () {//图
            //console.log('修改场景图');
            alive.ui.showPopup($("div#popup_edit_pic"));//修改图
        });
        
        oAsideSetAmendName.on('tap', function () {//名
        	 //console.log('修改设备名称');
        	 $("#panelName").val(document.title);
        	 alive.ui.showPopup($("div#popup_edit_name"));
        });
       
        oAsideSetBinding.on('tap', function () {//绑定引导
        	//console.log('绑定引导');
        	$(".open").show();
        	$(".close").hide();
        	alive.ui.showPopup($("div#popup_edit_lieveBtn"));//绑定引导显示
        });
        
        oAsideSetReBinding.on('tap', function () {//解除绑定
        	//console.log('解除绑定');
        	alive.ui.showPopup($("div#popup_edit_relieveBtn"));//解除绑定显示
        });
        
        oAsideSetChange.on('tap', function () {//开关交换
        	//console.log('开关交换');
        	alive.ui.showPopup($("div#popup_change_equipment"));//开关交换显示
        });
        
        oAsideSetDel.on('tap', function () {
            //console.log('删除设备');
            alive.ui.showPopup($("div#popup_del_equipment"));//删除层显示
        });
        
        oAsideSetVoid.on("tap",function(){//语音设置
        	//console.log('弹出语音设置');
        	$('#voidMsg').html("");
        	$("#void").show();
            $("#voidPwd").hide();
        	alive.ui.showPopup($('.popup#popup_voicePwd'));
        });
        
        oAsideSetLearn.on("tap",function(){//射频学习
        	if($("#radioValue").val() == null || $("#radioValue").val() == ""){
        		$("#learn_title").html("请点击开始学习");
				$(".popup_learn_btn").html("开始学习");
				$(".popup_cancel").css("display","block");
        	}else{
        		$("#learn_title").html("该场景已绑定过射频");
				$(".popup_learn_btn").html("取消绑定");
				$(".popup_cancel").css("display","none");
        	}
        	alive.ui.showPopup($("div#popup_learn"));
        });
        
        oAsideMachineControl.on("tap",function(){//添加机械手 
        	alive.ui.mask.hideMask();
        	$("#controlBtn").css("display","none");
        	$("#is_manipulator").css("display","none");
        	$("#setGoback").css("display","block");
			$("#choiceInss").css("display","block");
			$("header").css("display","none");
			$(".content").css("padding-top","0rem");
        });
        
        $("div#setGoback>a.add").on("tap",function(){//添加机械手返回
    		$("#controlBtn").css("display","block");
        	if($("#is_manipulator li").length <= 0){
    			$("#is_manipulator").hide();	//已绑定的机械手 标签隐藏
    		}else{
    			$("#is_manipulator").css("display","block");
    		}
        	$("#setGoback").css("display","none");
    		$("#choiceInss").css("display","none");
    		$("header").css("display","block");
    		$(".content").css("padding-top","40rem");
    		alive.tools.rewriteScroll();
    	});
        
        oAsideSetTime.on("tap",function(){//红外幕帘
        	//console.log('定时');
        	//时间和星期
			var timeValue=$("#irSettime").val();//获取数据库中 settime的值 8:50-10:50
			 
			var startTime = timeValue.split("-")[0]; //8:50
			var endTime = timeValue.split("-")[1];//10:50
			$("#start_input_hours").val(startTime.split(":")[0]);//获取 小时 8
			$("#start_input_minutes").val(startTime.split(":")[1]);//获取 分钟 50
			
			$("#end_input_hours").val(endTime.split(":")[0]);//获取 小时 10
			$("#end_input_minutes").val(endTime.split(":")[1]);//获取 分钟 50
			alive.ui.showPopup($('.popup#popup_timer'));
        });
    }
};

//语音口令弹出层_帮助UI  12 23
alive.ui.voicePwdHelp = function (){
    var oVoiceHelp = $('.popup .voicePwd_help>a');
    if ( oVoiceHelp.length > 0 ) {
        //console.log('找到语音口令帮助');
        
        var oVoiceHelpDiv = $('.popup .voicePwd_help>div');

        oVoiceHelp.on('touchstart', function () {
            //console.log('点击语音口令帮助');
            oVoiceHelpDiv.show();
            
            var nVoiceDivHeight = oVoiceHelpDiv.height();//获取高度
            oVoiceHelpDiv.css('top',-nVoiceDivHeight);//重新定位
            
            oVoiceHelpDiv.addClass('helpInUp');
        }).on('touchmove touchend touchcancel', function () {
            //console.log('取消口令帮助');
            if ( oVoiceHelpDiv.hasClass('helpInUp') ) {
                setTimeout(function () {
                    oVoiceHelpDiv.removeClass('helpInUp');
                    oVoiceHelpDiv.addClass('helpOutDown');
                    setTimeout(function () {
                        oVoiceHelpDiv.removeClass('helpOutDown');
                        oVoiceHelpDiv.hide();
                    },200);
                },200);
            } else {
                return false;
            }
        });
    }
}; 

//定时设置UI  12 23
var setTimeWeek="";//定时的星期
alive.ui.popupTimer = function () {
    if ( $('.popup#popup_timer').length > 0 ) {
        //console.log('找到定时设置');
        
        //星期选择UI
        var aWeekSelect = $('#popup_timer .timer_week>a');
        aWeekSelect.on('tap', function () {
        	if($("#timeStart").val() == "1"){
        		alive.ui.waitAlert("请先关闭定时后再进行设置！");
				alive.ui.mask.showMask(26);
				setTimeout(function(){
					alive.ui.hidePopup($("div#popup_alert"));
					alive.ui.mask.showMask(20);
				},1000);
    			return false;
        	}
            if( $(this).hasClass('active') ) {
                $(this).removeClass('active');
                setTimeWeek = setTimeWeek.replace(this.title + "," , "");
            } else {
                $(this).addClass('active');
                setTimeWeek = setTimeWeek+this.title+",";
            }
        });
    }
};

//电视控制页面UI
alive.ui.tv = {};

//app
alive.app = {};

//标签切换
alive.app.tabChange = function (){
	var aNavTab = $('nav>a');
	var aTabContent = $('.content>div');
	for (var i=0; i<aNavTab.length; i++){
		(function(i){
			aNavTab[i].addEventListener('tap',function(){
				alive.ui.indexInfo();
				if ( this.className == 'active' ){
					//console.log('点击了原标签');
					return false;
				}
				if(this.id == "scene"){
					$(".add_scene").show();
				}else{
					$(".add_scene").hide();
				}
				$('body').scrollTop = 0;
				for(var j=0; j<aNavTab.length; j++){
					aNavTab[j].className = '';
					aTabContent[j].className = '';
				};
				aNavTab[i].className = 'active';
				aTabContent[i].className = 'active';
				alive.ui.initializeIndex();
				alive.tools.rewriteScroll();
			});
		})(i);
	}
};

// 主页 长按扩展内容
alive.app.longTapIndexList = function () {
	//初始化btn_out_hover隐藏
	var aBtnOutHover = $('.btn_out_hover');
	var aBtnOutDefault = $('.btn_out_default');
	var aTelecontrolIcon = $('section#telecontrol ul icon');
	var aExpansionList = $('.expansion');
	
	//绑定长按事件
	for(var i=0; i<aExpansionList.length; i++){
		(function(i){
			aExpansionList[i].addEventListener('longTap',function(){
				if($(this).hasClass('active')){
					//对已经展开的扩展再次长按→收起扩展
					alive.ui.initializeIndex();
					if ( $(this).hasClass('touch_active_dark') ){
                        $(this).removeClass('touch_active_dark');
                    }
				}else{
					//张开扩展
					alive.ui.initializeIndex();
					$(this).addClass('active'); 
                    if ( $(this).hasClass('touch_active') ){
                        $(this).removeClass('touch_active');
                    }
                    $('li.active .btn_out_default').hide();//主页 开启/on/off/stop 隐藏
					$('li.active icon').hide();//红外设备图标隐藏
					$('li.active .scene_li_right').hide();//场景页命令文字提示隐藏
					$('li.active .btn_out_hover').show();//主页 显示删除按钮
					$('li.active .btn_hover_allow').show();//管理页长按显示删除按钮
					$('li.active .btn_out_allow').hide();//管理页长按隐藏授权按钮
				}
			});
		})(i);
	};
};

//内页按钮(灯 插座 窗帘 开窗器)长按
var btnID=0;//按钮ID
var contID=0;//内容ID
var voidPwdVal="";//语音口令值

alive.app.longBtn = function(){
	var btnLongMenu=$("section.longmenu");
	for(var i=0; i<btnLongMenu.length; i++){
		(function(i){
			btnLongMenu[i].addEventListener('longTap',function(){
				btnID=this.id;
				contID=this.title.split("#")[0];//内容ID content表
				voidPwdVal=this.title.split("#")[1];//语音口令值
				alive.ui.showPopup($("div#popup_longTap_equipment"));//按钮长按菜单
			});
		})(i);
	}
};

//首页条目点击
alive.app.tapIndexList = function () {
	var goUrl;
	var aIndexList = $('.content section>ul>li');
    if( aIndexList.length > 0 ){
        
        alive.app.tapIndexList.removeTouchActive = function (object) {
            if ( object.hasClass('touch_active_dark') ){
                object.removeClass('touch_active_dark');
            }
            if ( object.hasClass('touch_active') ){
                object.removeClass('touch_active');
            }
        };
        
        //按键效果
        aIndexList.on('touchstart', function () {
            if ( $(this).hasClass('active') ){
                $(this).addClass('touch_active_dark');
            }else{
                $(this).addClass('touch_active');
            }
        }).on('touchmove', function () {
            alive.app.tapIndexList.removeTouchActive($(this));
        }).on('touchend', function () {
            alive.app.tapIndexList.removeTouchActive($(this));
        }).on('touchcancel', function () {
            alive.app.tapIndexList.removeTouchActive($(this));
        });
        
        //点击事件
        for(var i=0; i<aIndexList.length; i++){
            aIndexList[i].addEventListener('tap',function(e){
                if ( $('.content section li.active').length > 0 ) {
                    //对已经展开的扩展再次长按→收起扩展
                    alive.ui.initializeIndex();
                } else {
                    //判断跳转
                    switch( this.title ){
                        //点击灯 插座 红外 安防
                        case 'equipment' :
                        case 'security' :
                            //console.log('跳转灯 插座 红外 安防页面');
                            goUrl=document.getElementById(this.id+"_url").value;
        					window.location.href="/smartHome_1/findsecPage/"+goUrl+"-"+openid+"-"+userid;
                        break;
                        //添加设备
                        case 'addCtrl' :
                            //console.log('跳转添加设备');
                            var ctrlID=this.id;
                            if(ctrlID == 1){//灯
                            	goUrl="add_light";
                            }else if(ctrlID == 2){//插座
                            	goUrl="add_socket";
                            }else if(ctrlID == 3 ){//墙面插座  12 14 
                            	goUrl="add_wallSocket";
                            }else if(ctrlID == 4 ){//窗帘
                            	goUrl="add_curtains";
                            }else if(ctrlID == 5 ){//开窗器 12 16
                            	goUrl="add_openWindow";
                            }else if(ctrlID == 6 ){//空调
                            	goUrl="add_MyARC";
                            }else if(ctrlID == 7 ){//电视
                            	goUrl="add_MyTV";
                            }else if(ctrlID == 8 ){//机顶盒
                            	goUrl="add_MyDVB";
                            }else if(ctrlID == 9 || ctrlID == 10 || ctrlID == 11 || ctrlID == 12 || ctrlID == 14 || ctrlID == 15){//安防
                            	goUrl="add_warning";
                            }else if(ctrlID == 13 ){//机械手
                            	goUrl="add_manipulator";
                            }
                            window.location.href ="/smartHome_1/goYindao/"+ctrlID+"-"+codeid+"-"+openid+"-"+userid+"-"+goUrl;
                        break;
                        //场景中添加指令
                        case 'choiceInss' :
                            //console.log('场景中添加指令');
                            goUrl=document.getElementById(this.id+"_url").value;
        					window.location.href="/smartHome_1/findsecPage/"+goUrl+"-"+openid+"-"+userid+"-"+sceneID+"-0";
                        break;
                        case 'goScene' : // 2015 12 11 点击场景直接进入场景页面
                            //console.log('进入场景');
        					var SceneID=this.id;
        					window.location.href="/smartHome_1/sceneCont/"+SceneID+"-"+codeid+"-"+openid+"-"+userid;
                        break;
                        case 'warnMachineControl'://机械手
                        	$.ajax({
                				type:"post",
                				url:"/smartHome_1/machineControlOperation",
                				data:"machineID="+this.id+"&secID="+secID+"&mFlg=add",
                				success:function(secID) {
                					window.location.href="/smartHome_1/findsecPage/warning_controller-"+$("#firstID").val()+"-"+codeid+"-"+openid+"-"+userid;
                				}
                			});
                        	break;
                        case 'changeHost' :
                        	$("div#popup_alert_changeHost>section.popup_confirm>h1").html("是否切换为&nbsp"+this.id+"&nbsp号主机？");
                        	alive.ui.showPopup($("div#popup_alert_changeHost"));
                        	changeCodeID = this.id;
                        	break;
                        
                        default: 
                            //跳转页面
                            //console.log('将跳转');
                    }
                }
            });
        };
    }
};

//主页button按钮控制事件
var shebeiID;// 设备ID
var panelType;// 面板类型  区分场景 / 设备 / 场景指令时用
var sceCont;// 场景中的内容
var firstID;// 一级页面ID
var machineRun=true;// 机器运行状态初始化
alive.app.indexBtnCommand = function () {
	//阻止button冒泡
	$('.content section li>div').on('tap', function (e) { 
		e.stopPropagation(); 
	}, false);
	$('.content section li>div').on('longTap', function (e) { 
		e.stopPropagation(); 
	}, false);
	
	//绑定按钮功能
	var aIndexBtn = $('.expansion>div a');
	aIndexBtn.on('tap', function () { 
		var titleValue=this.title.split("-")[0];
		switch( this.dataset.btnfn ){
				//点击删除按钮
				case 'del' :
					//console.log('删除');
					
					if(titleValue == "inss"){//场景
						panelType="inss";//场景 指令
						shebeiID=this.title.split("-")[1];//ID
						alive.ui.showPopup($("div#popup_del_equipment"));
						break;
					}else if(titleValue == "equipment"){
						panelType="equipment";// 我的设备
					}else if(titleValue == "scene"){
						panelType="scene";// 场景
					}
					shebeiID=this.title.split("-")[1];//ID
					
					$("div#popup_alert_Index>section.popup_confirm>h1").html("是否删除？");
					alive.ui.showPopup($("div#popup_alert_Index"));//删除确认框显示
				break;
				
				//点击on按钮
				case 'on' :
					//console.log('开');
					firstID=this.parentNode.title;
					btnNum="0";
					onORoff(firstID,btnNum);
				break;
				
				//点击 off/窗帘 开窗器的stop 按钮
				case 'off' :
					//console.log('关 / 窗帘 开窗器的停');
					firstID=this.parentNode.title;
					btnNum="1";
					onORoff(firstID,btnNum);
				break;
				
				//点击 窗帘 开窗器的off 按钮
				case 'stop' :
					//console.log('窗帘 开窗器的关');
					firstID=this.parentNode.title;
					btnNum="2";
					onORoff(firstID,btnNum);
				break;
				
				//点击开启按钮
				case 'run' :
					//console.log('开启');
					panelType="runSce";/* 开启场景 */
					shebeiID=this.title;
					
					$("div#popup_alert_Index>section.popup_confirm>h1").html("是否开启场景？");
					alive.ui.showPopup($("div#popup_alert_Index"));
				break;
				case 'delMachineControl': //删除机械手  安防页面
					$.ajax({
        				type:"post",
        				url:"/smartHome_1/machineControlOperation",
        				data:"machineID="+this.title+"&secID="+secID+"&mFlg=del",
        				success:function(value) {
        					window.location.href="/smartHome_1/findsecPage/warning_controller-"+$("#firstID").val()+"-"+codeid+"-"+openid+"-"+userid;
        				}
        			});
					break;
				
				default: false;	
		}
	});
};

/* 主页 灯 插座 开关 发送数据 */
function onORoff(firstID,btnNum){
	$.ajax({
		type:"post",
		url:"/smartHome_1/openORclose",
		data:"firstID="+firstID+"&btnNum="+btnNum,
		success:function(command) {
			//发送数据
			$.ajax({
				type:"post",
				url:"/smartHome_1/commSends",
				data:"userid="+userid+"&codeid="+codeid+"&command="+command,
				success:function(value) {
					// controller验证返回
					if (value == "0") {
						$('.alertMsg').html("主机未联网！");
						alive.ui.popupShowHide();
					} 
				}
			});
		}
	});
}

/* 添加场景2015 12 11 */
alive.app.addScene = function(){
	$("a.add_scene").on("tap",function(){
    	window.location.href ="/smartHome_1/goAddScene/"+codeid+"-"+openid+"-"+userid;
	});
	
	/* 点击图标 */
	var selectSvg=$("section>article>div#boxContentSvg>div");
	for (var i=0; i<selectSvg.length; i++){
		(function(i){
			selectSvg[i].addEventListener('tap',function(){
				if ($("#svg"+selectSvg[i].id).attr("class") == "borderSize"){
					//console.log('点击了原图标');
					return false;
				}
				for(var j=0; j<selectSvg.length; j++){
					$("#svg"+selectSvg[j].id).attr("class","");
				};
				$("#svg"+selectSvg[i].id).attr("class","borderSize");
				$("#scePic").val(this.title);
				$("section aside>a.disable").hide();
				$("section aside>a.able").show();
			});
		})(i);
	};
	
	/* 添加指令 */
	$("a#add").on("tap",function(){
		if(this.className == "add"){
			$(".add").html("返回");
			$(".add").addClass("goback");
			
			//将智能场景内容更换为 智能设备列表
			$("#inss").css("display","none");
			$("#choiceInss").css("display","block");
			$("header").css("display","none");
			$(".content").css("padding-top","0rem");
			document.title="请选择遥控对象";
		}else {
			$(".add").html("添加命令");
			$(".add").removeClass("goback");
			
			//将智能场景内容更换为 智能设备列表
			$("#inss").css("display","block");
			$("#choiceInss").css("display","none");
			$("header").css("display","block");
			$(".content").css("padding-top","40rem");
			document.title=$("#headName").html();
		}
		alive.tools.rewriteScroll();
	});
	
	/**
	 * 2015 12 14 场景内部 开启按钮点击
	 */
	//阻止button冒泡
	$('header div#insidePage_head').on('tap', function (e) { 
		e.stopPropagation(); 
	}, false);
	$('header div#insidePage_head').on('longTap', function (e) { 
		e.stopPropagation(); 
	}, false);
	
	//场景页上 定时和开启按钮
	$("header>div#insidePage_head>a").on("tap",function(){
		switch( this.dataset.btnfn ){
			//点击定时  12 23
			case 'setTime' :
				//console.log('定时');
				//时间和星期
				var timeValue=$("#timeValue").val();//获取数据库中 setTime的值
				 
				timeValue=timeValue.split(" ");//拆分获得的值 0 0 0 ? * *
				$("#input_hours").val(timeValue[2]);//获取 小时
				$("#input_minutes").val(timeValue[1]);//获取 分钟
				var time=timeValue[5]+",";//获取 星期  格式为 *, 
				setTimeWeek=time.replace("*,","");//去除星期中的 *, 
				 
				var aWeek = $('#popup_timer .timer_week>a');
				for(var i=0;i<aWeek.length;i++){
					var weekTitle = aWeek[i].title;//获取页面上每个 星期按钮上的title值 
					if(timeValue[5].indexOf(weekTitle)!= -1){//如果 获取的title值 在 从数九获取的星期值里面
						$("."+i).addClass('active');
					}
				}
				 
				alive.ui.showPopup($('.popup#popup_timer'));
				break;
			//点击开启 12 23
			case 'openScene' :
				//console.log('开启');
				 
				alive.ui.waitAlert("请等待...请勿触碰任何位置！");
				
				$.ajax({
					type:"post",
					url:"/smartHome_1/getScene",
					data:"sceID="+sceneID,
					dataType: "json",   
					success:function(data) {
						sceCont=data.scenecont;
						machineRun=true;
						setTimeout(function(){
							sendCommand();
						}, 1000);
					}
				});
				break;
		}
	});
};

//场景开启 发送数据
var length=0;/* 场景内容长度的初始化 */
function sendCommand(){
	//console.log(machineRun);
	if(machineRun == true){
		if(sceCont[length] !="" && sceCont[length] !=null && sceCont[length] !=undefined){
			if(length<sceCont.length){
				var command=sceCont[length].scecont_event;
				$.ajax({
   					type:"post",
   					url:"/smartHome_1/commSends",
   					data:"userid="+userid+"&codeid="+codeid+"&command="+command,
   					success:function(value) {	
   						if (value == "0") {
   							$('.alertMsg').html("主机未联网！");
   							alive.ui.popupShowHide();
   							machineRun = false;
   						}else if (value != "0"){
   							length++;
   							if(length<sceCont.length){
   				 				setTimeout(sendCommand, 1000);
   				 			}else{
   				 				$('.alertMsg').html("场景执行完毕！");
   				 				alive.ui.popupShowHide();
   				 				length=0;
   				 			}
   						}
   						if(command.split("#")[1] == "06"){ //场景中执行空调的指令时 将改变的值加入到数据库
   							$.ajax({
   		 						type:"post",
   		 						url:"/smartHome_1/update_arcFuncitonValue",
   		 						data:"arcMode="+command.split("#")[0].split(".")[2]+"&arcTemperature="+command.split("#")[0].split(".")[3]+"&arcWindnum="+command.split("#")[0].split(".")[4]+"&arcWinddirection="+command.split("#")[0].split(".")[5]+"&arcEwinddirection="+command.split("#")[0].split(".")[6]
   		 							 +"&arcHandWinddirection="+command.split("#")[0].split(".")[7]+"&arcClockHour="+command.split("#")[0].split(".")[8]+"&arcTimingOpen="+command.split("#")[0].split(".")[9]+"&arcTimingClose="+command.split("#")[0].split(".")[10]+"&arcKeyvalue="+command.split("#")[0].split(".")[11]
   		 							 +"&arcFunctionflag="+command.split("#")[0].split(".")[12]+"&arcTimingstate7="+command.split("#")[0].split(".")[13]+"&arcTimingstate3="+command.split("#")[0].split(".")[14]+"&arcClockMinute="+command.split("#")[0].split(".")[15]+"&secID="+command.split("#")[2],
   		 					});
   						}
   					}
   				}); 
			}
		}else {
			$('.alertMsg').html("当前场景无指令!");
			alive.ui.popupShowHide();
			length=0;
		}
	}else{
		machineRun = true;
		length=0;
	}
}

//场景定时页上开启/关闭定时 12 23 
/**
 * 12 29 关闭定时后数字和日期不重置，且定时图标变成灰色；开启定时后图标变成蓝色。
 */
alive.app.SceneSwitch = function () {
	var oIndexBlock = $('.switch_wrap_scene block');
	var oIndexSvg =$('div#insidePage_head>a.btn_header_time>svg');

	oIndexBlock.on("touchmove", function (e) {
		e.preventDefault();
	});
	oIndexBlock.on("swipeLeft", function () {
		if (this.dataset.switchBlock == 'switch_on') {
			this.dataset.switchBlock = 'switch_off';
			//console.log('关闭定时');
			oIndexSvg.attr("class","icon-60-gray");
			if(htmlflg == "scene"){
	   			$.ajax({
			   		 type:"post",
			   		 url:"/smartHome_1/removeTime",
			   		 data:"sceID=" + sceneID +"&codeid=" + codeid +"&time="+$("#timeValue").val(),
			   		 success:function(){
			   			
			   			$("#timeStart").val("0");
			   		 }
			   	});
			}else if(htmlflg == "warning"){
				$.ajax({
			   		 type:"post",
			   		 url:"/smartHome_1/removeIrCurtainTime",
			   		 data:"contID=" + $("#irContID").val(),
			   		 success:function(){
			   			$("#timeStart").val("0");
			   		 }
			   	});
			}
		}else{
			return false;
		}
	});
	oIndexBlock.on("swipeRight", function () {
		if (this.dataset.switchBlock == 'switch_off') {
			this.dataset.switchBlock = 'switch_on';
			//console.log('开启定时');
			oIndexSvg.attr("class","icon-60-blue");
			if(htmlflg == "scene"){
   			$.ajax({
   				type:"post",
   				url:"/smartHome_1/sceSetTime",
   				data:"sceID=" + sceneID + "&codeid=" + codeid + "&userid=" + userid + "&minutes=" + $("#input_minutes").val() + "&hours=" + $("#input_hours").val() + "&week=" + setTimeWeek.substring(0,setTimeWeek.length-1),
		   		success:function(){
		   			$("#timeStart").val("1");
		   			$("#timeValue").val("0 "+ $('#input_minutes').val() +" "+ $("#input_hours").val() +" ? * "+ setTimeWeek.substring(0,setTimeWeek.length-1));
		   		}
   			});
			}else if(htmlflg == "warning"){
				$.ajax({
	   				type:"post",
	   				url:"/smartHome_1/IrCurtainSetTime",
	   				data:"contID=" + $("#irContID").val() + "&codeid=" + codeid +"&userid=" + userid + "&startminutes=" + $("#start_input_minutes").val() + "&starthours=" + $("#start_input_hours").val()+ "&endminutes=" + $("#end_input_minutes").val() + "&endhours=" + $("#end_input_hours").val(),
			   		success:function(){
			   			$("#timeStart").val("1");
			   			$("#irSettime").val($("#start_input_hours").val()+":"+$("#start_input_minutes").val()+"-"+$("#end_input_hours").val()+":"+$("#end_input_minutes").val());
			   		}
	   			});
			}
		}else{
			return false;
		}
	});
};

//定时UI 时 分 加减 12 23
/**
 * 12 29 时间加减处 获取当前的值进行加减
 */
alive.app.timePopupBtn = function(){
	if ( $('#popup_timer').length > 0 ) {
        var clockBtn = $('a.clockBtn');
        clockBtn.on('tap', function () {
        	if($("#timeStart").val() == "1"){
        		alive.ui.waitAlert("请先关闭定时后再进行设置！");
				alive.ui.mask.showMask(26);
				setTimeout(function(){
					alive.ui.hidePopup($("div#popup_alert"));
					alive.ui.mask.showMask(20);
				},1000);
    			return false;
        	}
        	if(htmlflg == "scene"){
        		var hNum=0;
        		var mNum=0;
        		hNum=$("#input_hours").val();
            	mNum=$("#input_minutes").val();
                switch( this.title ){
                    case 'hPlusBtn' :
                        //console.log('时 加');
                        hNum++;
                        if(hNum < 0 || hNum >23){
                        	hNum=0;
                        }
                        $("#input_hours").val(hNum);
                        
                        break;
                    case 'mPlusBtn' :
                        //console.log('分 加');
                        mNum++;
                        if(mNum < 0 || mNum > 59){
                        	mNum=0;
                        }
                        $("#input_minutes").val(mNum);
                        
                        break;
                    case 'hMinusBtn' :
                        //console.log('时 减');
                        hNum--;
                        if(hNum < 0 || hNum > 23){
                        	hNum=23;
                        }
                        $("#input_hours").val(hNum);
                        
                        break;
                    case 'mMinusBtn' :
                        //console.log('分 减');
                        mNum--;
                        if(mNum < 0 || mNum > 59){
                        	mNum=59;
                        }
                        $("#input_minutes").val(mNum);
                        
                        break;
                    default: false;
                }
        	} else if(htmlflg == "warning"){
        		var starthNum=0;
        		var startmNum=0;
        		var endhNum=0;
        		var endmNum=0;
        		
        		starthNum=$("#start_input_hours").val();
        		startmNum=$("#start_input_minutes").val();
        		endhNum=$("#end_input_hours").val();
        		endmNum=$("#end_input_minutes").val();
                switch( this.title ){
                    case 'start_hPlusBtn' :
                        //console.log('时 加');
                    	starthNum++;
                        if(starthNum < 0 || starthNum >23){
                        	starthNum=0;
                        }
                        $("#start_input_hours").val(starthNum);
                        
                        break;
                    case 'start_mPlusBtn' :
                        //console.log('分 加');
                    	startmNum++;
                        if(startmNum < 0 || startmNum > 59){
                        	startmNum=0;
                        }
                        $("#start_input_minutes").val(startmNum);
                        
                        break;
                    case 'start_hMinusBtn' :
                        //console.log('时 减');
                    	starthNum--;
                        if(starthNum < 0 || starthNum > 23){
                        	starthNum=23;
                        }
                        $("#start_input_hours").val(starthNum);
                        
                        break;
                    case 'start_mMinusBtn' :
                        //console.log('分 减');
                    	startmNum--;
                        if(startmNum < 0 || startmNum > 59){
                        	startmNum=59;
                        }
                        $("#start_input_minutes").val(startmNum);
                        
                        break;
                        
                    case 'end_hPlusBtn' :
                        //console.log('时 加');
                    	endhNum++;
                        if(endhNum < 0 || endhNum >23){
                        	endhNum=0;
                        }
                        $("#end_input_hours").val(endhNum);
                        
                        break;
                    case 'end_mPlusBtn' :
                        //console.log('分 加');
                    	endmNum++;
                        if(endmNum < 0 || endmNum > 59){
                        	endmNum=0;
                        }
                        $("#end_input_minutes").val(endmNum);
                        
                        break;
                    case 'end_hMinusBtn' :
                        //console.log('时 减');
                    	endhNum--;
                        if(endhNum < 0 || endhNum > 23){
                        	endhNum=23;
                        }
                        $("#end_input_hours").val(endhNum);
                        
                        break;
                    case 'end_mMinusBtn' :
                        //console.log('分 减');
                    	endmNum--;
                        if(endmNum < 0 || endmNum > 59){
                        	endmNum=59;
                        }
                        $("#end_input_minutes").val(endmNum);
                        
                        break;
                    default: false;
                }
        	}
        		
        });
	}
};

//汉字正则  两位以上
function CheckChinese(chinese){
	var filter=/^[\u4e00-\u9fa5]{2,}$/;
	if(filter.test(chinese)){
		return false;
	}else {
		return true;
	}
	
}

//设置语音口令 12 23
var urlFunc="";
alive.app.voicePwd_3btn = function(){
	if ( $('#popup_voicePwd').length > 0 ) {
		var voicePwd_3btn = $('div#popup_voicePwd section.voicePwd_3btn>a');
		voicePwd_3btn.on('tap', function () { 
			switch( this.title ){
	            case 'EditBtn' :
	                //console.log('修改按钮');
	                $("#voidPwd").val($("#void").val());
	                $("#void").hide();
	                $("#voidPwd").show();
	                
	                break;
	            case 'ClearBtn' :
	                //console.log('清空按钮');
	                
	                if( $("#voidPwd").val().length > 0 || $("#void").val().length > 0 ){
	                	if($("#sceID").val().length <= 0){
	                		sceneID=0;
	                	}
	                	$.ajax({
		    				type:"post",
		    				url:"/smartHome_1/delVoidPwd",
		    				data:"sceID="+ sceneID + "&contID=" + contID,
		    				success:function(value) {
		    					// controller验证返回
		    					if(value == "success"){
		    						$("#voidPwd").val("");
		    						$("#void").val($("#voidPwd").val());
		    						$("#voidPwd").hide();
		    						$("#void").show();
		    						
		    						$('#voidMsg').html("口令删除成功，请从新设置。");
		    						$('#voidMsg').show();
		    						setTimeout(function(){
		    							$('#voidMsg').hide();
		    		                },1000);
		    					}
		    					if (value == "error") {
		    						$('#voidMsg').html("口令删除失败！");
		    						$('#voidMsg').show();
		    						setTimeout(function(){
		    							$('#voidMsg').hide();
		    		                },1000);
		    					} 
		    					if($("#sceID").val().length <= 0){
	    							sceneID="";
	    							$("#"+ btnID).attr("title",contID+"#"+$("#voidPwd").val());
	    						}
		    				}
		    			});
	                }
	                
	                break;
	            case 'SaveBtn' :
	                //console.log('保存按钮');
	                if($("#voidPwd").val().length > 0){
	                	if($("#sceID").val().length <= 0){
	                		sceneID=0;
	                	}
	                	if(!CheckChinese($("#voidPwd").val())){
		                	$.ajax({
			    				type:"post",
			    				url:"/smartHome_1/updateVoidPwd",
			    				data:"sceID="+sceneID+"&voidPwd="+$("#voidPwd").val()+"&codeID="+codeid+"&contID="+contID,
			    				success:function(value) {
			    					// controller验证返回
			    					if(value == "success"){
			    						$("#voidPwd").hide();
			    						$("#void").val($("#voidPwd").val());
			    						$("#void").show();
			    						
			    						$('#voidMsg').html("保存成功！");
			    						$('#voidMsg').show();
			    						setTimeout(function(){
			    							$('#voidMsg').hide();
			    		                },1000);
			    					}
			    					if (value == "error") {
			    						$('#voidMsg').html("保存失败！");
			    						$('#voidMsg').show();
			    						setTimeout(function(){
			    							$('#voidMsg').hide();
			    		                },1000);
			    					} 
			    					if(value == "theSame"){
			    						$('#voidMsg').html("失败:口令已被使用！");
			    						$('#voidMsg').show();
			    						setTimeout(function(){
			    							$('#voidMsg').hide();
			    		                },1000);
			    					}
			    					if($("#sceID").val().length <= 0){
		    							sceneID="";
		    							//console.log(btnID);
		    							//console.log(contID+"#"+$("#voidPwd").val());
		    							$("#"+ btnID).attr("title",contID+"#"+$("#voidPwd").val());
		    						}
			    					
			    				}
			    			});
	                	}else{
	                		$('#voidMsg').html("请输入两位以上的中文字符！");
							$('#voidMsg').show();
							setTimeout(function(){
								$('#voidMsg').hide();
			                },1000);
	                	}
	                }
	                break;
	            default: false;
			}
		});
	}
};

//主页滑动开关控制【滑动事件和CCS3动画在微信端运行不畅，暂时先直接瞬移到终点的样子，后面再调整】
alive.app.indexSwitch = function () {
	var secName=document.getElementById("secName").value;//场景中对应的指令的二级页面名
	var secPic=document.getElementById("secPic").value;//二级页面图片
	var oIndexBlock = $('.switch_wrap block');

	oIndexBlock.on("touchmove", function (e) {
		e.preventDefault();
	});
	oIndexBlock.on("swipeLeft", function () {
		if (this.dataset.switchBlock == 'switch_on') {
			this.dataset.switchBlock = 'switch_off';
			//console.log('撤防');
			//撤防事件写这里
			$.ajax({
				type:"post",
				url:"/smartHome_1/setIsNotSafe",
				data:"secid="+this.id+"&flg=0&sceID="+sceneID,
				success:function(value) {
					if (value == "success") {
						//撤防成功
						$('.alertMsg').html("撤防成功！");
						alive.ui.popupShowHide();
					}else if(value == "setScene"){
						$.ajax({
							type:"post",
							url:"/smartHome_1/getInstruction",
							data:"codeid="+codeid+"&insName=撤防&sceID="+sceneID+"&command=0#safe&secName="+secName+"&secPic="+secPic+"&secID="+secID,
							success:function(value) {
								
								$("a.alertMsg").html("添加成功！");
		    					alive.ui.showPopup($("div#popup_alert"));
		    					
								window.location.href="/smartHome_1/sceneCont/"+sceneID+"-"+codeid+"-"+openid+"-"+userid;
							}
						});
					}
				}
			});
		}else{
			return false;
		}
	});
	oIndexBlock.on("swipeRight", function () {
		if (this.dataset.switchBlock == 'switch_off') {
			this.dataset.switchBlock = 'switch_on';
			//console.log('设防');
			//设防事件写这里
			$.ajax({
				type:"post",
				url:"/smartHome_1/setIsNotSafe",
				data:"secid="+this.id+"&flg=1&sceID="+sceneID,
				success:function(value) {
					if (value == "success") {
						//设防成功
						$('.alertMsg').html("设防成功！");
						alive.ui.popupShowHide();
					}else if(value == "setScene"){
						$.ajax({
							type:"post",
							url:"/smartHome_1/getInstruction",
							data:"codeid="+codeid+"&insName=设防&sceID="+sceneID+"&command=1#safe&secName="+secName+"&secPic="+secPic+"&secID="+secID,
							success:function(value) {
								
								$("a.alertMsg").html("添加成功！");
		    					alive.ui.showPopup($("div#popup_alert"));
		    					
								window.location.href="/smartHome_1/sceneCont/"+sceneID+"-"+codeid+"-"+openid+"-"+userid;
							}
						});
					}
				}
			});
		}else{
			return false;
		}
	});
};

/* 内页 灯 插座 按钮点击事件 */
alive.app.contBtnEvent = function(){
	var btnOnOff=$('.onoffBtn>div>a');
	btnOnOff.on("tap",function(e){
		var command=this.title;
		var insName=this.name;
		eventSend(command,insName);
		e.stopPropagation();
	});
};

/* 内页 按钮 点击传递event */
function eventSend(command,insName){
	var secName=document.getElementById("secName").value;//场景中对应的指令的二级页面名
	var secPic=document.getElementById("secPic").value;//二级页面图片

	$.ajax({
		type:"post",
		url:"/smartHome_1/commSends",
		data:"userid="+userid+"&codeid="+codeid+"&command="+command+"&sceID="+sceneID,
		success:function(value) {
			// controller验证返回
			if (value == "0") {
				
				if(htmlflg == "ARC"){ // 空调页 当未联网时 空调功能标识为0
					$("#v11").val("32");
				}
				
				if($("#NumFlg").val() == "1" || $("#MoreBtnFlg").val() == "1"){
					alive.ui.waitAlert("主机未联网！");
					alive.ui.mask.showMask(26);
					setTimeout(function(){
						alive.ui.hidePopup($("div#popup_alert"));
						alive.ui.mask.showMask(20);
					},1000);
					return false;
				}
				
				$("a.alertMsg").html("主机未联网！");
				alive.ui.popupShowHide();
				
			} else if(value=="setScene"){//场景
				if(insName == "PowerBtnForARC"){
					alive.ui.showPopup($("div#popup_arc_powerBtn"));
				}else{
					$.ajax({
						type:"post",
						url:"/smartHome_1/getInstruction",
						data:"codeid="+codeid+"&insName="+insName+"&sceID="+sceneID+"&command="+command+"&secName="+secName+"&secPic="+secPic+"&secID="+secID,
						success:function(value) {
							
							$("a.alertMsg").html("添加成功！");
							alive.ui.hidePopup($("div#popup_arc_powerBtn"));
	    					alive.ui.showPopup($("div#popup_alert"));
	    					
							window.location.href="/smartHome_1/sceneCont/"+sceneID+"-"+codeid+"-"+openid+"-"+userid;
						}
					});
				}
			} else{
				if(htmlflg == "ARC"){ // 空调页 
					if($("#v11").val() != "32"){//开 且灯光亮
						//电源点击时 模式 温度 风速显示
						$(".icon"+$("#v1").val()).children().attr("class","icon-50-darkgray");
						$(".iconWind").children().attr("class","icon-50-darkgray");
						$(".runState").attr("style","color:#8d96a6");
						$(".temperatureNum").attr("style","color:#8d96a6");
						$(".centigrade").attr("style","color:#8d96a6");
						$("#midNum").attr("style","color:#8d96a6");
						
						//模式变化
						{
		            		var modeIcon = $("div.screen_top>div.icon>svg");
		                	// 模式显示状态
		                	if(modeIcon.hasClass("icon-50-darkgray")){
		                		modeIcon.attr("class","icon-50-icongray");
		                	}
		            	}
		            	$(".icon"+$("#v1").val()).children().attr("class","icon-50-darkgray");
		            	
						//温度数字变化
						$(".temperatureNum").html(parseInt(16)+parseInt($("#v2").val()));
						
						//风速变化
		            	if($("#v3").val() == "0"){
		            		$("#midNum").html("自动");
		            	}else if($("#v3").val() == "1"){
		            		$("#midNum").html("低速");
		            	}else if($("#v3").val() == "2"){
		            		$("#midNum").html("中速");
		            	}else if($("#v3").val() == "3"){
		            		$("#midNum").html("高速");
		            	}
		            	
		            	//睡眠
		            	if($("#v11").val() == "35"){
		            		$(".iconSleep").children().attr("class","icon-50-darkgray");
		            	}else{
		            		$(".iconSleep").children().attr("class","icon-50-icongray");
		            	}
		            	
		            	$.ajax({
	 						type:"post",
	 						url:"/smartHome_1/update_arcFuncitonValue",
	 						data:"arcMode="+$("#v1").val()+"&arcTemperature="+$("#v2").val()+"&arcWindnum="+$("#v3").val()+"&arcWinddirection="+$("#v4").val()+"&arcEwinddirection="+$("#v5").val()
	 							 +"&arcHandWinddirection="+$("#v6").val()+"&arcClockHour="+$("#v7").val()+"&arcTimingOpen="+$("#v8").val()+"&arcTimingClose="+$("#v9").val()+"&arcKeyvalue="+$("#v10").val()
	 							 +"&arcFunctionflag="+$("#v11").val()+"&arcTimingstate7="+$("#v12").val()+"&arcTimingstate3="+$("#v13").val()+"&arcClockMinute="+$("#v14").val()+"&secID="+$("#secID").val(),
	 					});
		            	
					}else{//全关
						$(".icon"+$("#v1").val()).children().attr("class","icon-50-icongray");
						$(".iconWind").children().attr("class","icon-50-icongray");
						$(".iconSleep").children().attr("class","icon-50-icongray");
						$(".runState").attr("style","color:#ccd0d9");
						$(".temperatureNum").attr("style","color:#ccd0d9");
						$(".centigrade").attr("style","color:#ccd0d9");
						$("#midNum").attr("style","color:#ccd0d9");
						$.ajax({
	 						type:"post",
	 						url:"/smartHome_1/update_arcFuncitonValue",
	 						data:"arcMode="+$("#v1").val()+"&arcTemperature="+$("#v2").val()+"&arcWindnum="+$("#v3").val()+"&arcWinddirection="+$("#v4").val()+"&arcEwinddirection="+$("#v5").val()
	 							 +"&arcHandWinddirection="+$("#v6").val()+"&arcClockHour="+$("#v7").val()+"&arcTimingOpen="+$("#v8").val()+"&arcTimingClose="+$("#v9").val()+"&arcKeyvalue="+$("#v10").val()
	 							 +"&arcFunctionflag="+$("#v11").val()+"&arcTimingstate7="+$("#v12").val()+"&arcTimingstate3="+$("#v13").val()+"&arcClockMinute="+$("#v14").val()+"&secID="+$("#secID").val(),
	 					});
					}
				}
			}
		}
	});
}

//电视控制页面app
alive.app.tv = {};

//电视/机顶盒控制页面button按钮控制事件
alive.app.tv.btnCommand = function () {
    if ( $('#tv_btn_group').length > 0 ) {
    	var btnClickFlg = 1;
        var aTvBtn = $('a.aBtn');
        var dataValue = $("#dataValue").val();
        //console.log('正在电视/机顶盒控制页面:共有'+aTvBtn.length+'个按钮');
        
        //暂时这么写2 17
        var btnLength=aTvBtn.length;
    	_btnLongTap = function (btnLength){//长按
    		for(var i=0; i<btnLength; i++){
         		(function(i){
         			aTvBtn[i].addEventListener('longTap',function(){
         				//空调页上不能删除默认按钮的事件
         				if($(this).hasClass("ArcBtn") ){
         					$("div#popup_longTap_red>section>a.red_rebind").css("display","none");
         					$("div#popup_longTap_red>section>a.red_changeFunc").css("display","none");
         				}else if($(this).hasClass("btn_header_close")) {
         					$("div#popup_longTap_red>section>a.red_changeFunc").css("display","none");
         				}else {
         					$("div#popup_longTap_red>section>a.red_rebind").css("display","block");
         					$("div#popup_longTap_red>section>a.red_changeFunc").css("display","block");
         				}

         				$("#btnFlg").val(this.parentNode.id);
         				btnID=this.parentNode.id;
         				contID=this.parentNode.title.split("#")[0];
         				voidPwdVal=this.parentNode.title.split("#")[1];
         				
         				//更多按钮
         				if($("div#popup_moreBtn").css("display") != "none"){
         					if(this.title == "#"){
         						$("div#popup_learn_btn>section>a.red_delBtn").css("display","block");
             					alive.ui.showPopup($("div#popup_learn_btn"),26,27);//更多按钮学习弹出层
            	        		return false;
            	        	}
         				}
         				
         				//数字按键
         				if($("div#popup_redNum").css("display") != "none"){
         					if(this.title == "#"){
         						$("div#popup_learn_btn>section>a.red_delBtn").css("display","none");
             					alive.ui.showPopup($("div#popup_learn_btn"),26,27);//更多按钮学习弹出层
            	        		return false;
            	        	}
         				}
         				
         				//默认按键
     					if(this.title == "#"){
     						$("div#popup_learn_btn>section>a.red_delBtn").css("display","none");
         					alive.ui.showPopup($("div#popup_learn_btn"));//按钮学习弹出层
        	        		return false;
        	        	}
         				
         				if($(this).hasClass("NumBtn") || $(this).hasClass("moreBtn") || $(this).hasClass("addmoreBtn")){
         					//数字、更多按钮和添加自定义按钮 长按时无操作
         					return false;
         				}else{
             				if($("div#popup_moreBtn").css("display") != "none"){//更多按钮
             					alive.ui.showPopup($("div#popup_longTap_redMore"),26,27);
             				}else if($("div#popup_redNum").css("display") != "none"){//数字按钮
             					alive.ui.showPopup($("div#popup_longTap_red"),26,27);
             				}else{//默认按钮
             					alive.ui.showPopup($("div#popup_longTap_red"));
             				}
         				}
         			
         			});
         		})(i);
         	}
    	};
        
        //绑定按钮功能
        _btnOnTap = function (){
    		 aTvBtn.on('tap', function (e) { 
    			 if(btnClickFlg == 1){
    				 console.log('超过一秒 或 第一次 或 有返回');
	 	        	e.stopPropagation();
	 	        	
	 	        	var command=this.title;
	     			var insName=this.name;
	     			
	 	        	$("#btnFlg").val(this.parentNode.id);
	 	        	if($("div#popup_redNum").css("display") != "none"){// 数字按键
	  					if(this.title == "#"){
	  						$("div#popup_learn_btn>section>a.red_delBtn").css("display","none");
	      					alive.ui.showPopup($("div#popup_learn_btn"),26,27);// 更多按钮学习弹出层
	     	        		return false;
	     	        	}
	  				}
	 	        	if($("div#popup_moreBtn").css("display") != "none"){// 更多按钮
	  					if(this.title == "#"){
	  						$("div#popup_learn_btn>section>a.red_delBtn").css("display","block");
	      					alive.ui.showPopup($("div#popup_learn_btn"),26,27);// 更多按钮学习弹出层
	     	        		return false;
	     	        	}
	  				}
	 				if(this.title == "#"){
	 					$("div#popup_learn_btn>section>a.red_delBtn").css("display","none");
	  					alive.ui.showPopup($("div#popup_learn_btn"));// 按钮学习弹出层
	 	        		return false;
	 	        	}
	 				
	 				_arcKeyValue = function(){
	 					var keyValueLength=document.getElementsByName("arckeyValue").length;
	 					var kValue;
	 					var ArcMzValue = command.split("#")[0];// 6.0
	 					for(var i=1;i<=keyValueLength;i++){
	 						kValue = document.getElementById("v"+i).value;
	 						ArcMzValue = ArcMzValue +"."+ kValue;
	 					};
	 					// console.log(ArcMzValue);//05
	 					if(command.split("#").length >= 3){
	 						command=ArcMzValue + "#"+command.split("#")[1]+"#"+command.split("#")[2];// 60000000000#05#sendARC  or sendURC
	 					}else{
	 						command=ArcMzValue + "#"+command.split("#")[1];// 60000000000#05
	 					}
	 					eventSend(command,insName);
	 				};
	 	            switch( this.dataset.btnfn ){
	 	                // 点击电视开关按钮
	 	                case 'red_switch' :
	 	                // 点击电视信息按钮
	 	                case 'tv_infoShow' :
	 	                // 点击电视"加"按钮
	 	                case 'tv_plus' :
	 	                // 点击电视"减"按钮
	 	                case 'tv_minus' :
	 	                // 点击电视上按钮
	 	                case 'tv_up' :
	 	                // 点击电视下按钮
	 	                case 'tv_down' :
	 	                // 点击选择按钮组"上"按钮
	 	                case 'tv_sctUp' :
	 	                // 点击选择按钮组"左"按钮
	 	                case 'tv_sctLeft' :
	 	                // 点击选择按钮组"OK"按钮
	 	                case 'tv_OK' :
	 	                // 点击选择按钮组"右"按钮
	 	                case 'tv_sctRight' :
	 	                // 点击选择按钮组"下"按钮
	 	                case 'tv_sctDown' :
	 	                // 点击电视静音按钮
	 	                case 'tv_mute' :
	 	                // 点击数字按键
	 	                case 'numBtn' :
	 	                // 机顶盒下一页
	 	                case 'dvb_next' :
	 	                // 机顶盒上一页
	 	                case 'dvb_back' :
	 	                // 点击更多按钮
	 	                case 'moreBtn' :
	 	        			eventSend(command,insName);
	 	        			break;
	 	        		// 空调电源
	 	                case 'arc_switch' :
	 	                	$("#v10").val("0");
	 	                	if($("#v11").val() == "32"){
	 	                		$("#v11").val("33");
	 	                	}else{
	 	                		$("#v11").val("32");
	 	                	}
	 						_arcKeyValue();
	 						break;
	 	                // 空调上
	 	                case 'arc_up' :
	 	                	if($("#v11").val() != "32"){
	 		                	$("#v10").val("1");
	 		                	// 对应的数值增加
	 		                	if(parseInt($("#v2").val()) < 16){
	 			                	$("#v2").val(parseInt($("#v2").val())+parseInt(1));
	 		                	}
	 		                	_arcKeyValue();
	 	                	}
	 	                	break;
	 	                // 空调下
	 	                case 'arc_down' :
	 	                	if($("#v11").val() != "32"){
	 		                	$("#v10").val("2");
	 		                	// 对应的数值减小
	 		                	if(parseInt($("#v2").val()) <= 16 && parseInt($("#v2").val()) > 0){
	 			                	$("#v2").val(parseInt($("#v2").val())-parseInt(1));
	 		                	}
	 		                	_arcKeyValue();
	 	                	}
	 	                	break;
	 	                // 空调模式
	 	                case 'arc_mode' :
	 	                	if($("#v11").val() != "32"){
	 		                	$("#v10").val("3");
	 		                	if(parseInt($("#v1").val()) == 4 ? $("#v1").val(0) : $("#v1").val(parseInt($("#v1").val())+parseInt(1)));
	 		                	_arcKeyValue();
	 	                	}
	 	                	break;
	 	                // 空调风速
	 	                case 'arc_air' :
	 	                	if($("#v11").val() != "32"){
	 		                	$("#v10").val("4");
	 		                	if(parseInt($("#v3").val()) == 3 ? $("#v3").val(0) : $("#v3").val(parseInt($("#v3").val())+parseInt(1)));
	 		                	_arcKeyValue();
	 	                	}
	 	                	break;
	 	                
	 	                // 空调睡眠
	 	                case 'arc_sleep' :
	 	                	if($("#v11").val() != "32"){
	 	                		$("#v10").val("10");
	 	                		if($("#v11").val() == "35"){
	 			                	$("#v11").val("33");
	 	                		}else{
	 	                			$("#v11").val("35");
	 	                		}
	 		                	_arcKeyValue();
	 	                	}
	 						break;
	 	
	 	                // 点击电视数字键按钮
	 	                case 'tv_number' :
	 	                    // console.log('电视数字键');
	 	                    $("#NumFlg").val("1");
	 	                    alive.ui.showPopup($("div#popup_redNum"));
	 	                    break;
	 	                
	 	                // 点击更多按钮
	 	                case 'red_more' :
	 	                    // console.log('更多按钮');
	 	                    $("#MoreBtnFlg").val("1");
	 	                    alive.ui.showPopup($("div#popup_moreBtn"));
	 	                    break;
	 	                // 点击自定义更多按钮
	 	                case 'addmore' :
	 	                    // console.log('自定义更多按钮');
	 	                    alive.ui.showPopup($("div#popup_addmoreBtn"));// 添加自定义按键
	 	                    break;
	 	                    
	 	                default: 
	 	                	false;
	 	            }
	 	            if(!dataValue.indexOf("InsideRed")>=0){
	 	            	 btnClickFlg = 0;
	 	            	 setTimeout(function(){
	 	            		 btnClickFlg = 1;
	 	            	 },1000);
	 	            }
    			 }else{
    				 console.log('不足一秒 或 没返回');
    				 return false;
				}
 	        });
        };
        
        _btnLongTap(btnLength);//长按
        _btnOnTap();//点击
        
      //自定义按键确定/取消 1 12
        var aAddMore = $('section>aside>a');
        var btnMore;//获取当前的按钮数量
        var moreID;//设置将要添加的按钮的libID
        aAddMore.on('tap',function(){
        	btnMore = $('section>div.moreBtn');
        	moreID = parseInt(btnMore.length,10)+parseInt(1,10);
        	if($(this).hasClass("DIYBtnYes")){//确定
        		$.ajax({
					type:"post",
					url:"/smartHome_1/addMoreBtn",
					data:"codeid="+codeid+"&secid="+secID+"&libID="+secID+moreID+"&moreBtnName="+$("#DIYBtnName").val(),
					success:function() {
						alive.app.addMoreBtn();//添加按钮
						
						alive.ui.initializePopup($("div#popup_moreBtn"));//窗口位置
						$("#DIYBtnName").val("");
			        	alive.ui.showPopup($("div#popup_moreBtn"));
			        	alive.ui.hidePopup($("div#popup_addmoreBtn"));
			        	
			        	//暂时这么写
			        	alive.ui.touchBtnDefault();//按钮显示效果
			        	aTvBtn = $('a.aBtn');
			        	_btnLongTap(aTvBtn.length);//调用按钮长按方法
			        	_btnOnTap();//调用按钮点击事件	
			        	
					}
				});
        	}
        	if($(this).hasClass("DIYBtnNo")){//取消
				$("#DIYBtnName").val("");
	        	alive.ui.showPopup($("div#popup_moreBtn"));
	        	alive.ui.hidePopup($("div#popup_addmoreBtn"));
        	}
        });
        
        //更多按钮添加
        alive.app.addMoreBtn = function(){
        	var moreDiv=document.createElement("div");
        	moreDiv.setAttribute("class","moreBtn");
        	moreDiv.setAttribute("id",secID+moreID);//486 10
        	
        	var moreA=document.createElement("a");
        	moreA.setAttribute("id","m"+secID+moreID);//m486 10
        	moreA.setAttribute("href","javascript:void(0)");
        	moreA.setAttribute("class","moreB btn_default btn_moreBtn_default aBtn");
        	moreA.setAttribute("data-btnfn","moreBtn");
        	moreA.setAttribute("title","#");
        	moreA.innerHTML=document.getElementById("DIYBtnName").value;
        	moreDiv.appendChild(moreA);
        	
        	var endMoreBtn=document.getElementById("out_moreBtn");
        	endMoreBtn.appendChild(moreDiv);
        };
    }
};
//空调进入页面时查询状态
alive.app.arcValue = function(){
	if($("#v11").val() != "32"){//开 且灯光亮
		//电源点击时 模式 温度 风速显示
		$(".icon"+$("#v1").val()).children().attr("class","icon-50-darkgray");
		$(".iconWind").children().attr("class","icon-50-darkgray");
		$(".runState").attr("style","color:#8d96a6");
		$(".temperatureNum").attr("style","color:#8d96a6");
		$(".centigrade").attr("style","color:#8d96a6");
		$("#midNum").attr("style","color:#8d96a6");
		
		//模式变化
    	$(".icon"+$("#v1").val()).children().attr("class","icon-50-darkgray");
    	
		//温度数字变化
		$(".temperatureNum").html(parseInt(16)+parseInt($("#v2").val()));
		
		//风速变化
    	if($("#v3").val() == "0"){
    		$("#midNum").html("自动");
    	}else if($("#v3").val() == "1"){
    		$("#midNum").html("低速");
    	}else if($("#v3").val() == "2"){
    		$("#midNum").html("中速");
    	}else if($("#v3").val() == "3"){
    		$("#midNum").html("高速");
    	}
    	
    	//睡眠
    	if($("#v11").val() == "35"){
    		$(".iconSleep").children().attr("class","icon-50-darkgray");
    	}else{
    		$(".iconSleep").children().attr("class","icon-50-icongray");
    	}
	}else{//全关
		$(".icon"+$("#v1").val()).children().attr("class","icon-50-icongray");
		$(".iconWind").children().attr("class","icon-50-icongray");
		$(".iconSleep").children().attr("class","icon-50-icongray");
		$(".runState").attr("style","color:#ccd0d9");
		$(".temperatureNum").attr("style","color:#ccd0d9");
		$(".centigrade").attr("style","color:#ccd0d9");
		$("#midNum").attr("style","color:#ccd0d9");
	}
};

//添加设备页面app
alive.app.add = {};

//添加设备页面跳转APP
alive.app.add.skip = function () {
    var aAddPageSection = $('section.add_page_section');
    if ( aAddPageSection.length > 0 ) {
        //console.log('正在添加设备界面：共有'+aAddPageSection.length+'个添加页');
    	
    	//高度赋值
    	$('section.add_page_section_apple').css('height',$(window).height());
        
        var aAddPageSkipBtn = $('a.add_skip_btn');
        
        alive.app.add.skip.program = function ( obj , increment , setOrder ) {
            var nCurrentOrder;
            //获取序列
            var oOriginalSection = obj.parent().parent('section.add_page_section');
            var sOriginalSectionID = oOriginalSection.attr('id');
            var nOriginalSectionOrder = parseInt ( sOriginalSectionID.charAt( sOriginalSectionID.length - 1) );
            increment = typeof(increment) == 'undefined' ? '0' : increment; 
            nCurrentOrder = typeof(setOrder) == 'undefined' ? nOriginalSectionOrder + parseInt( increment ) : setOrder;
            
            if($('section#add_page_order_' + nCurrentOrder ).length > 0){
                var oCurrentSection = $('section#add_page_order_' + nCurrentOrder );
                oOriginalSection.removeClass('section_show');
                setTimeout(function(){
                    oOriginalSection.hide();
                    oCurrentSection.show();
                    oCurrentSection.addClass('section_show');
                },200);
            } else {
                //console.log('err:没有匹配到一个正确的section');
            }
        };
        
        //绑定
        aAddPageSkipBtn.on('tap', function () {
            switch( this.dataset.addBtnfn ){
                //返回主页
                case 'back_home' :
                    //console.log('点击返回主页按钮');
                    alive.ui.showPopup($('div#popup_add_confirmBackHome'));
                    break;
                    
                //上一步  
                case 'prev' :
                    //console.log('点击上一步按钮');
                    var htmlflgTF = htmlflg == "URCyindao" || htmlflg == "ARCyindao";
                    if(htmlflgTF && $("#htmlBH").val() == "2"){
                    	$("#htmlBH").val("1");
                    	setTimeout(function(){
                    		$("#firstBtn").show();
                        },200);
                    }else if(htmlflgTF && $("#htmlBH").val() == "3"){
                    	$("#htmlBH").val("2");
                    }
                    alive.app.add.skip.program($(this) , '-1');
                    setTimeout(function(){
            			alive.tools.rewriteScroll();
                    },200);
                    break;
                    
                //下一步
                case 'next' :
                    //console.log('点击下一步按钮'+htmlflg);
                    if((htmlflg == "URCyindao" || htmlflg == "ARCyindao")&& $("#htmlBH").val() == "1"){
                    	$("#mzBianhao").val("1");
                    	$("#htmlBH").val("2");
                    	setTimeout(function(){
                    		$("#firstBtn").hide();
                        },200);
                    	alive.app.add.skip.program($("#spaceDiv") , '1');
                    }else {
                    	alive.app.add.skip.program($(this) , '1');
                    }
                    setTimeout(function(){
            			alive.tools.rewriteScroll();
                    },200);
                    if(this.title == "name"){ //灯 插座
                    	$.ajax({
            				type:"post",
            				url:"/smartHome_1/addRandom",
            				success:function(value) {
            					if (value != "") {
	            					var open=value.split("-")[0];
	            					var close=value.split("-")[1];
            						/* 灯 */
            						$(".LearnOn").attr("title",open+"#05");
            						$(".LearnOff").attr("title",close+"#05");
            						$(".yindaoLearnOn").attr("title",open+"#05");
            						$(".yindaoLearnOff").attr("title",close+"#05");
            						/* 随机码 */
            						$("#random").attr("value",value);
            					}
            				}
            			});
                    }else if(this.title == "socket"){//转接插座
                    	$.ajax({
            				type:"post",
            				url:"/smartHome_1/addRandomSwitch",
            				success:function(value) {
            					if (value != "") {
	            					var open=value.split("-")[0];
	            					var close=value.split("-")[1];
            						/*转接插座 */
            						$(".LearnOn").attr("title",open+"#05");
            						$(".LearnOff").attr("title",close+"#05");
            						$(".yindaoLearnOn").attr("title",open+"#05");
            						$(".yindaoLearnOff").attr("title",close+"#05");
            						/* 随机码 */
            						$("#random").attr("value",value);
            					}
            				}
            			});
                    }else if(this.title == "warning"){//安防
                    	fadeSta ="1";
                    }else if(this.title == "curtains"){//窗帘
                    	$.ajax({
            				type:"post",
            				url:"/smartHome_1/addRandomBy40",
            				success:function(value) {
            					if (value != "") {
	            					var open=value.split("-")[0];
	            					var stop=value.split("-")[1];
	            					var close=value.split("-")[2];
	            					var set=value.split("-")[3];
            						/* 窗帘 */
            						$(".setBtn").attr("title",set+"#05");
            						$(".openBtn").attr("title",open+"#05");
            						$(".stopBtn").attr("title",stop+"#05");
            						$(".closeBtn").attr("title",close+"#05");
            						/* 随机码 */
            						$("#random").attr("value",value);
            					}
            				}
            			});
                    }else if(this.title == "openWindow"){//开窗器
                    	$.ajax({
            				type:"post",
            				url:"/smartHome_1/addRandomBy24",
            				success:function(value) {
            					if (value != "") {
	            					var open=value.split("-")[0];
	            					var stop=value.split("-")[1];
	            					var close=value.split("-")[2];
            						/* 窗帘 */
            						$(".setBtn").attr("title",stop+"#05");
            						$(".openBtn").attr("title",open+"#05");
            						$(".stopBtn").attr("title",stop+"#05");
            						$(".closeBtn").attr("title",close+"#05");
            						/* 随机码 */
            						$("#random").attr("value",value);
            					}
            				}
            			});
                    }else if(this.title == "manipulator"){//机械手
                    	$.ajax({
            				type:"post",
            				url:"/smartHome_1/addRandomManipulator",
            				success:function(value) {
            					if (value != "") {
	            					var open=value.split("-")[0];
	            					var close=value.split("-")[1];
            						/*转接插座 */
            						$(".LearnOn").attr("title",open+"#05");
            						$(".LearnOff").attr("title",close+"#05");
            						$(".yindaoLearnOn").attr("title",open+"#05");
            						$(".yindaoLearnOff").attr("title",close+"#05");
            						/* 随机码 */
            						$("#random").attr("value",value);
            					}
            				}
            			});
                    }
                    break;
                    
                //返回2
                case 'return_2' :
                    //console.log('点击回到2按钮');
                    alive.app.add.skip.program($(this) , '' , '2');
                    break;
                    
                //返回3
                case 'return_3' :
                    //console.log('点击回到3按钮');
                    alive.app.add.skip.program($(this) , '' , '3');
                    break;
                    
                //完成
                case 'fin' :
                    //console.log('点击完成添加按钮');
                    
                    alive.ui.waitAlert("添加成功！");
                    var form = document.getElementById("addForm");
                	form.submit();
                    break;
                    
                default: false;	
            }
            
        });
        
        //电视 机顶盒 空调 品牌地区选择
        if($(".redPage_section").length > 0){
        	var selectRed=$("div.redCont");
    		for (var i=0; i<selectRed.length; i++){
    			(function(i){
    				selectRed[i].addEventListener('tap',function(){
    					$("#mzNum").val(this.title);
    					$("#ppID").val(this.id);
    					if ($(this).hasClass("touch_active")){
    						$(this).removeClass("touch_active");
    						$(".ableNext").css("display","none");
    						$(".disableNext").css("display","block");
    						return false;
    					}
    					$(".disableNext").css("display","none");
    					$(".ableNext").css("display","block");
    					$(".redCont").removeClass("touch_active");
    					$(this).addClass("touch_active");
    				});
    			})(i);
    		}
        }
    }
};

/* 引导页 按钮 发数据 */
alive.app.add.addBtnEvent = function(){
	var addonORoff=$(".addOnOff>a");
	addonORoff.on("tap",function(){
		var command=this.title;
		$.ajax({
			type:"post",
			url:"/smartHome_1/commSends",
			data:"userid="+userid+"&codeid="+codeid+"&command="+command,
			success:function(value) {
				if (value == "0") {
					$("a.alertMsg").html("主机未联网！");
					alive.ui.popupShowHide();
				} 
			}
		});
	});
};

/* 红外(电视、机顶盒)引导 按钮匹配时发送数据 */
alive.app.add.btnPep = function(){
	var closeBtn=$('div.firstBtn');
	var upBtn=$('div.secondBtn');
	var redEvent;
	var valueNum;
	closeBtn.off().on("tap",function(){
		$("div#errorMsg1").show();
		$("div#errorMsg1>p").html("请稍等！请勿点击其他地方！"+$("#mzBianhao").val()+","+$("#mzNum").val());
		$.ajax({
			type:"post",
			url:"/smartHome_1/RedmzValue",
			//ppid 品牌ID               shebeiFlg设备标识 电视3 空调6 机顶盒1  btnFlg 页面上需匹配的按钮的第一个按钮的键值  mzBianhao 当前品牌所匹配的码组编号
			data:"ppid="+$("#ppID").val()+"&shebeiFlg="+$("#shebeiFlg").val()+"&btnFlg="+$("div.firstBtn").attr("title")+"&mzBianhao="+$("#mzBianhao").val(),
			success:function(value) {
				var shebeiFlg=value.split("-")[0];//3
				var mzValue=value.split("-")[1];//284
				var btnFlg=value.split("-")[2];//2
				
				if(htmlflg == "URCyindao"){
					redEvent=shebeiFlg+"."+mzValue+"."+btnFlg+"#07";//3.284.2#07
				}else if(htmlflg == "ARCyindao"){
					redEvent=shebeiFlg+"."+mzValue+"."+btnFlg+"#06";//6.22.0.12.0.0.0.0.0.0.0.0.33.0.0.0#06
				}
				
				$("#mzValue").val(mzValue);
				$.ajax({
					type:"post",
					url:"/smartHome_1/commSends",
					data:"userid="+userid+"&codeid="+codeid+"&command="+redEvent,
					success:function(value) {
						if (value == "0") {
							$("div#errorMsg1").hide();
							$("a.alertMsg").html("主机未联网！");
							alive.ui.popupShowHide();
						}else if(value == "sendSuccess"){
							setTimeout(function(){
								$("div#errorMsg1>p").html("若长时间未响应，请再点击一次按钮！!");
							},1000);
						}
					}
				});
			}
		});
	});
	
	upBtn.off().on("tap",function(){
		$("div#errorMsg2").show();
		$("div#errorMsg2>p").html("请稍等！请勿点击其他地方！"+$("#mzBianhao").val()+","+$("#mzNum").val());
		
		if(htmlflg == "URCyindao"){
			redEvent=$("#shebeiFlg").val()+"."+$("#mzValue").val()+"."+$("div.secondBtn").attr("title")+"#07";//6.284.14#06
		}else if(htmlflg == "ARCyindao"){
			redEvent=$("#shebeiFlg").val()+"."+$("#mzValue").val()+"."+$("div.secondBtn").attr("title")+"#06";//6.22.0.13.0.0.0.0.0.0.0.0.33.0.0.0#07
		}
		$.ajax({
			type:"post",
			url:"/smartHome_1/commSends",
			data:"userid="+userid+"&codeid="+codeid+"&command="+redEvent,
			success:function(value) {
				if (value == "0") {
					$("div#errorMsg1").hide();
					$("a.alertMsg").html("主机未联网！");
					alive.ui.popupShowHide();
				}else if(value == "sendSuccess"){
					setTimeout(function(){
						$("div#errorMsg2>p").html("若长时间未响应，请再点击一次按钮！!");
					},1000);
				}
			}
		});
	});
};

/* 内页 引导按钮 发数据 */  //2015 12 1 遮罩层修改
alive.app.setBtnEvent = function(){
	var addonORoff=$(".setaddOnOff>a");
	addonORoff.on("tap",function(){
		var command=this.title;
		$.ajax({
			type:"post",
			url:"/smartHome_1/commSends",
			data:"userid="+userid+"&codeid="+codeid+"&command="+command,
			success:function(value) {
				if (value == "0") {
					alive.ui.waitAlert("主机未联网！");
					alive.ui.mask.showMask(26);
					setTimeout(function(){
						alive.ui.hidePopup($("div#popup_alert"));
						alive.ui.mask.showMask(20);
					},1000);
				} 
			}
		});
	});
};

//弹窗内部app
var dataId;//ID的类型
var smartFunc;//smartHome 中的方法
alive.app.add.popupBtn = function () {
    if ( $('div.popup a.popup_backHome').length >0 ){
        //绑定返回主页确定按钮
        $('div.popup a.popup_backHome').on('tap',function () {
        	window.location.href="/smartHome_1/goHome/"+gzhflag+"-"+userid+"-"+openid;
        });
    }
    if ( $("div#popup_alert_Index").length >0 ){//12 28 index.html 删除提示框 最外层ID 由"popup_del_Index " =>"popup_alert_Index"
        //主页删除/场景开启确定
        $('div.popup a.confirm').on('tap',function () { // 12 28 index.html 删除提示框 改为 确认提示框 class="deleteOK" =>"confirm"
			if(panelType == "runSce"){//开启场景 12 28 
				$.ajax({
					type:"post",
					url:"/smartHome_1/getScene",
					data:"sceID="+shebeiID,
					dataType: "json",   
					success:function(data) {
						sceCont=data.scenecont;
						machineRun=true;
						setTimeout(function(){
							sendCommand();
						}, 1000);
					}
				});
				alive.ui.hidePopup($("div#popup_alert_Index"));
				
				alive.ui.waitAlert("请等待...请勿触碰任何位置！");
				return false;
			}
			if(panelType == "equipment"){//设备
				$.ajax({
					type:"post",
					url:"/smartHome_1/deleteSec",
					data:"firstID="+shebeiID,
					success:function(value) {
						if (value == "deleteSuccess") { // 12 28 传值修改 "1" => "deleteSuccess"
							$('.alertMsg').html("删除成功！");
							alive.ui.popupShowHide();
							$("#"+shebeiID).remove();
							_initialize();
							
						}
					}
				});
				alive.ui.hidePopup($("div#popup_alert_Index"));
				
				alive.ui.waitAlert("请稍等！");
				return false;
			}
			if(panelType == "scene"){//场景
				$.ajax({
					type:"post",
					url:"/smartHome_1/deleteScene",
					data:"sceID="+shebeiID+"&codeID="+codeid,
					success:function(value) {
						if (value == "deleteSuccess") { // 12 28 传值修改 "1" => "deleteSuccess"
							$('.alertMsg').html("删除成功！");
							alive.ui.popupShowHide();
							$("#"+shebeiID).remove();
							_initialize();
						}
					}
				});
				alive.ui.hidePopup($("div#popup_alert_Index"));
				alive.ui.waitAlert("请稍等！");
				return false;
			} 
        });
    }
    if ( $("div#popup_del_equipment").length >0 ){
    	//内页删除
    	$('div.popup a.deleteOK').on('tap',function () {
    		if(panelType == "inss"){//场景中的指令
				$.ajax({
					type:"post",
					url:"/smartHome_1/deleteSceContOne",
					data:"scecontID="+shebeiID,
					success:function(value) {
						if (value == "delsuccess") {
							_initialize();
						}
					}
				});
				$("#"+shebeiID).remove();
				alive.ui.hidePopup($("div#popup_del_equipment"));
				alive.ui.mask.hideMask();
    		} else {
    			if(htmlflg == "scene"){/* 场景删除 */
    				dataId="sceID";
    				idVal=sceneID;
    				smartFunc="deleteScene";
    			}else{/* 灯 插座 空调 电视 机顶盒 机械手 */
    				dataId="firstID";
    				idVal=$("#firstID").val();
    				smartFunc="deleteSec";
    			}
    			$.ajax({
    				type:"post",
    				url:"/smartHome_1/"+smartFunc,
    				data:dataId+"="+idVal+"&codeID="+codeid,
    				success:function(value) {
    					
    					alive.ui.hidePopup($("div#popup_del_equipment"));
    					alive.ui.waitAlert("删除成功！");
    					
    					window.location.href="/smartHome_1/goHome/"+gzhflag+"-"+userid+"-"+openid;
    				}
    			});
    		}
    	});
    }
    
  //开关交换
    if ( $("div#popup_change_equipment").length >0 ){
    	var tON = null;
    	var tOFF = null;
    	var contID1=0;
    	var contID2=0;
    	//开关交换
    	$('div.popup a.changeOK').on('tap',function () {
    		tON = $("div#On>a.on").attr("title");
    		tOFF = $("div#Off>a.off").attr("title");
    		contID1=$("div#On>a.on").parent().parent().attr("title").split("#")[0];
    		contID2=$("div#Off>a.off").parent().parent().attr("title").split("#")[0];
    		$.ajax({
				type:"post",
				url:"/smartHome_1/changeONOFF",
				data:"contID1="+contID1+"&contID2="+contID2,
				success:function() {
					$("div#On>a.on").attr("title",tOFF);
		    		$("div#Off>a.off").attr("title",tON);
		    		alive.ui.hidePopup($("div#popup_change_equipment"));
		    		$("a.alertMsg").html("交换成功！");
					alive.ui.popupShowHide();
				}
			});
    	});
    }
    
  //改变绑定的主机
    if ( $("div#popup_alert_changeHost").length >0 ){
    	$('div.popup a.changeOK').on('tap',function () {
    		$.ajax({
				type:"post",
				url:"/smartHome_1/changeHost",
				data:"openID="+openid+"&machineID="+changeCodeID,
				success:function() {
		    		alive.ui.hidePopup($("div#popup_alert_changeHost"));
		    		$("a.alertMsg").html("切换成功！");
					alive.ui.popupShowHide();
					// 跳转到主页
					window.location.href="/smartHome_1/smarthome/"+userid;
				}
			});
    	});
    }
    
    if ( $("div#popup_edit_name").length >0 ){//改名
		$("div.popup a.nameY").on("tap",function(){
			var name=$("#panelName").val();//设备名
			
			if(htmlflg == "scene"){/* 场景修改名 */
				dataId="sceID";
				idVal=sceneID;
				dataName="sceName";
				smartFunc="updateScene";
			}else{/* 灯 插座 空调 电视 净化器 */
				dataId="secID";
				idVal=secID;
				dataName="secName";
				smartFunc="updateSec";
			}
			
			$.ajax({
				type:"post",
				url:"/smartHome_1/"+smartFunc,
				data:dataName+"="+name+"&"+dataId+"="+idVal,
				success:function() {
					document.title=name;
					$("#headName").html(name);
					alive.ui.hidePopup($("div#popup_edit_name"));
					$("a.alertMsg").html("修改成功！");
					alive.ui.popupShowHide();
				}
			});
		});
    }

	 if ( $("div#popup_arc_powerBtn").length >0 ){//空调开关选择
		$("div.popup a.powerBtnOpen").on("tap",function(){
			var sendCom = this.title;
			eventSend(sendCom+".0.9.0.0.0.0.0.0.0.0.33.0.0.0#06","电源开");
		});
		
		$("div.popup a.powerBtnClose").on("tap",function(){
			var sendCom = this.title;
			eventSend(sendCom+".0.0.0.0.0.0.0.0.0.0.32.0.0.0#06","电源关");
		});
    }

//    if ( $("div#popup_edit_relieveBtn").length >0 ){//解除绑定
//		$("div.popup a.relieveComplete").on("tap",function(){
//			alive.ui.hidePopup( $("div#popup_edit_relieveBtn") );
//			alive.ui.mask.hideMask();
//		});
//    }
    if ( $("div#popup_edit_lieveBtn").length >0 ){//绑定设备 2015 12 14
    	if(htmlflg == "light" || htmlflg == "curtains" || htmlflg == "wallscoket" || htmlflg == "openWindow" || htmlflg == "manipulator"){
			/* 点击上一步 */
			$("div.popup a.lieveUp").on("tap",function(){
				$(".open").show();
				$(".close").hide();
			});
			/* 点击下一步 */
			$("div.popup a.lieveNext").on("tap",function(){
				$(".open").hide();
				$(".close").show();
			});
//			/* 点击完成 */
//			$("div.popup a.lieveComplete").on("tap",function(){
//				alive.ui.hidePopup( $("div#popup_edit_lieveBtn") );
//				alive.ui.mask.hideMask();
//			});
			
		}else if(htmlflg == "scoket"){
			/* 插座 点击完成 */
			$("div.popup a.lieveNext").on("tap",function(){
				alive.ui.hidePopup( $("div#popup_edit_lieveBtn") );
				alive.ui.mask.hideMask();
			});
		}
    }
    if ( $("div#popup_edit_pic").length >0 ){//改图   2015 12 08
    	 var picSrc;
		/* 点击图标 */
		var selectSvg=$("div#boxContentSvg>div");
		for (var i=0; i<selectSvg.length; i++){
			(function(i){
				selectSvg[i].addEventListener('tap',function(){
					if ($("#svg"+selectSvg[i].id).attr("class") == "borderSize"){
						//console.log('点击了原图标');
						return false;
					}
					for(var j=0; j<selectSvg.length; j++){
						$("#svg"+selectSvg[j].id).attr("class","");
					};
					$("#svg"+selectSvg[i].id).attr("class","borderSize");
					picSrc=this.title;
					$("div.popup a.disableY").hide();
					$("div.popup a.editPicY").show();
				});
			})(i);
		}
			
		/*点击确定*/
		$("div.popup a.editPicY").on("tap",function(){
			$.ajax({
				type:"post",
				url:"/smartHome_1/updateScene",
				data:"scePic="+picSrc+"&sceID="+$("#sceID").val(),
				success:function() {
					alive.ui.hidePopup( $("div#popup_edit_pic") );
					
					$("a.alertMsg").html("修改成功！");
					alive.ui.popupShowHide();
					
					$("div.popup a.disableY").show();
					$("div.popup a.editPicY").hide();
					$("#scenePic").html("<svg class='icon-170-lightblue'><use xlink:href='/beetl/smartHome_1/icon/xlink_icon.svg#"+picSrc+"'></use></svg>");
				}
			});
		});
    }
    
    //非红外按钮长按 语音口令  灯 插座等
    if($("div#popup_longTap_equipment").length > 0){
		$(".voidPwd").on("tap",function(){//语音设置
	    	//console.log('弹出语音设置s');
	    	 $("#void").val(voidPwdVal);
	    	 
	    	 $("#void").show();
	         $("#voidPwd").hide();
	         
	    	 $("#popupVoid").html("");//12 25
	    	alive.ui.hidePopup($("div#popup_longTap_equipment"));
	    	alive.ui.showPopup($('.popup#popup_voicePwd'));
	    });
	}
    
    // 红外按钮长按
    if($("div#popup_longTap_red").length > 0){
		$("div#popup_longTap_red>section>a.red_voidPwd").on("tap",function(){//语音设置
	    	//console.log('红外弹出语音设置');
	    	$("#void").val(voidPwdVal);
	    	 
			$("#void").show();
			$("#voidPwd").hide();
			$("#popupVoid").html("");//12 25
	    	alive.ui.hidePopup($("div#popup_longTap_red"));
	    	alive.ui.showPopup($('.popup#popup_voicePwd'),26,27);
	    });
		
		$("div#popup_longTap_red>section>a.red_rebind").on("tap",function(){//解除绑定
	    	//console.log('红外弹出解除绑定');
	    	
	    	alive.ui.hidePopup($("div#popup_longTap_red"));
	    	setTimeout(function(){
	    		alive.ui.showPopup($('.popup#popup_rebind_red'),26,27);
        	},100);
	    	
	    	//console.log($("div#popup_moreBtn").css("display"));
	    	if($("div#popup_rebind_red").length > 0 && $("div#popup_moreBtn").css("display") == "none"){
	    		$(".rebindOK").on("tap",function(){ //解除绑定点击确定
	    			//console.log('红外解除绑定点击确定');
	    			$.ajax({
	    				type:"post",
	    				url:"/smartHome_1/btnOperation",
	    				data:"secID="+secID+"&libID="+btnID+"&bFlg=delEve",
	    				success:function(value) {
	    					if(value == "success"){
	    						//暂时
	    						alive.ui.hidePopup($("div#popup_rebind_red"));
	    						$("#a"+ btnID).attr("title","#");
	    						$("#"+ btnID).attr("title",contID+"#");
	    						
	    						$('.alertMsg').html("解绑成功！");
	    						alive.ui.showPopup($("div#popup_alert"),26,27);
	    						if(($("div#popup_redNum").css("display") != "none" || $("div#popup_moreBtn").css("display") != "none") && ($("#htmlFlg").val() == "TV" || $("#htmlFlg").val() == "DVB")){
	    							setTimeout(function(){
		    			        		alive.ui.hidePopup($("div#popup_alert"));
		    			        		alive.ui.mask.showMask(20);
		    			        	},1000);
	    						}else if($("div#popup_moreBtn").css("display") != "none" && $("#htmlFlg").val() == "ARC"){
	    							setTimeout(function(){
		    			        		alive.ui.hidePopup($("div#popup_alert"));
		    			        		alive.ui.mask.showMask(20);
		    			        	},1000);
	    						}else{
	    							alive.ui.popupShowHide();//提示消失
	    						}
	    					}
	    				}
	    			});
	    		});
	    	}
	    });
		
		$("div#popup_longTap_red>section>a.red_changeFunc").on("tap",function(){//更改按键功能
	    	//console.log('更改按键功能');
			alive.ui.hidePopup($("div#popup_longTap_red"));
			var redBtnKey = $("#redBtnKey").val();
			
			if(redBtnKey == 2){
				redBtnKey=3;
			}else if(redBtnKey > 36){
				redBtnKey=1;
			}
			$.ajax({
				type:"post",
				url:"/smartHome_1/redBtnChangeFunc",
				data:"secID="+secID+"&libID="+btnID+"&htmlFlg="+htmlflg+"&redBtnKey="+redBtnKey,
				success:function(value) {
					console.log(value);
					if(value != "error"){
						$("#a"+ btnID).attr("title",value+"#07");//改变title值
						$("#redBtnKey").val(++redBtnKey);//改变当前的key
						
						$("a.alertMsg").html("更换成功！请点击按钮！");
						alive.ui.popupShowHide();
					}else{
						$("a.alertMsg").html("更换失败！请重新更换一次！");
						alive.ui.popupShowHide();
					}
					
				}
			});
	    });
	}
    
    //红外 更多按钮长按
    if($("div#popup_longTap_redMore").length > 0){
		$("div#popup_longTap_redMore>section>a.red_voidPwd").on("tap",function(){//语音设置
	    	//console.log('更多按钮弹出语音设置');
	    	$("#void").val(voidPwdVal);
	    	
	    	$("#void").show();
			$("#voidPwd").hide();
			$("#popupVoid").html("");
	    	alive.ui.hidePopup($("div#popup_longTap_redMore"));
	    	alive.ui.showPopup($('.popup#popup_voicePwd'),26,27);
	    });
		
		
		$("div#popup_longTap_redMore>section>a.red_rebind").on("tap",function(){//解除绑定
	    	//console.log('弹出解除绑定');
	    	
	    	alive.ui.hidePopup($("div#popup_longTap_redMore"));
	    	alive.ui.showPopup($('.popup#popup_rebind_red'),26,27);
	    	
	    	//console.log($("div#popup_moreBtn").css("display"));
	    	if($("div#popup_rebind_red").length > 0 && $("div#popup_moreBtn").css("display") != "none"){
	    		$(".rebindOK").on("tap",function(){
	    			$.ajax({
	    				type:"post",
	    				url:"/smartHome_1/btnOperation",
	    				data:"secID="+secID+"&libID="+btnID+"&bFlg=delEve",
	    				success:function(value) {
	    					if(value == "success"){
	    						//暂时
	    						alive.ui.hidePopup($("div#popup_rebind_red"));
	    						$("#m"+ btnID).attr("title","#");
	    						
	    						$('.alertMsg').html("解绑成功！");
	    						alive.ui.showPopup($("div#popup_alert"),26,27);
	    			        	setTimeout(function(){
	    			        		alive.ui.hidePopup($("div#popup_alert"));
	    			        		alive.ui.mask.showMask(20);
	    			        	},1000);
	    					}
	    				}
	    			});
	    		});
	    	}
	    });
		
		$("div>section>a.red_delBtn").on("tap",function(){//删除按键
	    	//console.log('弹出删除按键');
	    	
	    	alive.ui.hidePopup($("div#popup_longTap_redMore"));
	    	alive.ui.hidePopup($("div#popup_learn_btn"));
	    	alive.ui.showPopup($('.popup#popup_del_red'),26,27);
	    	
	    	if($("div#popup_del_red").length > 0){
	    		$(".delOK").on("tap",function(){
	    			$.ajax({
	    				type:"post",
	    				url:"/smartHome_1/btnOperation",
	    				data:"secID="+secID+"&libID="+btnID+"&bFlg=delBtn",
	    				success:function(value) {
	    					if(value == "success"){
	    						//暂时
	    						alive.ui.hidePopup($("div#popup_del_red"));
	    						
	    						$("#"+btnID).remove();
	    						
	    						alive.ui.initializePopup($("div#popup_moreBtn"));//窗口位置
	    						
	    						$('.alertMsg').html("删除成功！");
	    						alive.ui.showPopup($("div#popup_alert"),26,27);
	    			        	setTimeout(function(){
	    			        		alive.ui.hidePopup($("div#popup_alert"));
	    			        		alive.ui.mask.showMask(20);
	    			        	},1000);
	    					}
	    				}
	    			});
	    		});
	    	}
	    });
	}
    
    //按钮自主学习
    if($("div#popup_learn_btn").length > 0){
    	$("div#popup_learn_btn>section>a.learnOne").on("tap",function(){//单键学习
	    	//console.log('单键学习');
    		var learnComm = "";
    		if(htmlflg == "ARC"){
    			learnComm = "ARC#01";
    		}else if(htmlflg == "DVB" || htmlflg == "TV"){
    			learnComm = "URC#01";
    		}
    		$.ajax({
				type:"post",
				url:"/smartHome_1/commSends",
				data:"userid="+userid+"&codeid="+codeid+"&command="+learnComm,
				success:function(value) {
					if(value == "0"){
						alive.ui.waitAlert("主机未联网！");
						alive.ui.mask.showMask(26);
						setTimeout(function(){
							alive.ui.hidePopup($("div#popup_alert"));
							alive.ui.mask.showMask(20);
						},1000);
//						alive.ui.showPopup($(".popup#popup_add_btnResponse"));
					}else if(value == "setScene"){
						alive.ui.waitAlert("请勿在添加场景的时候进行学习！");
						alive.ui.mask.showMask(26);
						setTimeout(function(){
							alive.ui.hidePopup($("div#popup_alert"));
							alive.ui.mask.showMask(20);
						},1000);
					}else{
						alive.ui.waitAlert("请等待...请勿触碰任何位置！");
						alive.ui.mask.showMask(26);
					}
				}
			});
    		
	    });
    	
    	$("div#popup_learn_btn>section>a.learnMore").on("tap",function(){//组合键学习
	    	//console.log('组合键学习');
	    	
	    	$('.alertMsg').html("功能尚未完善！");
			alive.ui.showPopup($("div#popup_alert"),27,28);
			setTimeout(function(){
        		alive.ui.hidePopup($("div#popup_alert"));
        		alive.ui.mask.showMask(20);
        	},1000);
	    });
    }
    
    if ( $('div.popup a.popup_learn_btn').length >0 ){
        //绑定返回主页确定按钮
        $('div.popup a.popup_learn_btn').on('tap',function () {
        	if($("#radioValue").val() == null || $("#radioValue").val() == ""){
        		learnSta = "1";
            	$('.alertMsg').html("学习中请稍等！");
    			alive.ui.showPopup($("div#popup_alert"),27,28);
    			alive.ui.hidePopup($("div#popup_learn"));
        	}else {
        		$.ajax({
    				type:"post",
    				url:"/smartHome_1/sceRadioValue",
    				data:"valueID="+sceneID+"&radioValue=",
    				success:function(value) {
    					alive.ui.hidePopup($("div#popup_learn"));
    					alive.ui.mask.hideMask();
    					$("#radioValue").val("");
    				}
    			});
        	}
        	
        });
        
        $('div.popup a.popup_learn_fin').on('tap',function () {
        	$.ajax({
				type:"post",
				url:"/smartHome_1/sceRadioValue",
				data:"valueID="+sceneID+"&radioValue="+$("#random").val(),
				success:function(value) {
					alive.ui.hidePopup($("div#popup_learn_fin"));
					alive.ui.mask.hideMask();
					$("#radioValue").val($("#random").val());
					$("#learn_title").html("该功能已绑定，是否取消绑定？");
					$(".popup_learn_btn").html("取消绑定");
					$(".popup_cancel").css("display","none");
				}
			});
			
        });
    }
};


// 管理页
alive.app.add.admin = function () {
    var aEQPSection = $('section.EQP_section');
    var pwdFlg=0;
    if ( aEQPSection.length > 0 ) {
        //console.log('正在管理界面：共有'+aEQPSection.length+'个管理页');
        
        var winHeight = $(window).height();
        $("section.EQP_Height").css("height",winHeight);
        
        var aEqpPageSkipBtn = $('a.EQP_btn');
        
        alive.app.add.admin.program = function ( obj , increment , setOrder ) {
            var nCurrentOrder;
            //获取序列
            var oOriginalSection = obj.parent().parent('section.EQP_section');
            var sOriginalSectionID = oOriginalSection.attr('id');
            var nOriginalSectionOrder = parseInt ( sOriginalSectionID.charAt( sOriginalSectionID.length - 1) );
            increment = typeof(increment) == 'undefined' ? '0' : increment; 
            nCurrentOrder = typeof(setOrder) == 'undefined' ? nOriginalSectionOrder + parseInt( increment ) : setOrder;
            
            if($('section#EQP_' + nCurrentOrder ).length > 0){
                var oCurrentSection = $('section#EQP_' + nCurrentOrder );
                oOriginalSection.removeClass('EQP_show');
                setTimeout(function(){
                    oOriginalSection.hide();
                    oCurrentSection.show();
                    oCurrentSection.addClass('EQP_show');
                },200);
            } else {
                //console.log('err:没有匹配到一个正确的section');
            }
        };
        
        //绑定
        aEqpPageSkipBtn.on('tap', function () {
            switch( this.dataset.addBtnfn ){
                //初始密码/登陆 退出
                case 'back_WX' :
                    //console.log('点击退出按钮');
                    alive.ui.showPopup($("div#popup_EQP_out"));//退出确定显示
                    break;
                    
                //初始密码确认
                case 'finish' :
                    //console.log('点击初始密码确认按钮');
                    
                    if(!CheckPwd($("#initPwd").val(),1)){ //判断输入的初始密码 格式是否正确
                    	break;
                    }
                    if($("#initPwd").val() != $("#twicePwd").val()){// 两次密码不一致
                    	$("section>div.twicePwd").show();
        				$("section>svg.testOk.twicePwd").hide();
        				$("section>div.email").hide();
                    	break;
    				}else{
    					$("section>div.twicePwd").hide();
        				$("section>svg.testOk.twicePwd").show();
    				}
                    if(pwdFlg != 1){// 1 是重置密码 !=1 是初始密码
                        if(!CheckMail($("#safeEmail").val())){ //验证邮箱格式
                        	break;
                        }
                    }
                    alive.ui.showPopup($("div#popup_EQP_finish"));// 全都正确后  弹框显示
                    break;
                    
                //登陆
                case 'login' :
                	var thisObj=$(this);
                    //console.log('点击登陆按钮');
                    $.ajax({
        				type:"post",
        				url:"/smartHome_1/checkUserPwd",
        				data:"codeid="+codeid+"&userPwd="+$("#userPwd").val()+"&btnFlg=pwd&userid="+userid,
        				success:function(value) {
        					if( value == "equals" ){
        						$("#userPwd").val("");
        						alive.app.add.admin.program(thisObj , '3');//跳到 管理页面
        						$("a.alertMsg").html("登录成功！");
        						alive.ui.popupShowHide();//提示消失
            					alive.ui.inputValTestAlertNone();// input 和 错误提示
        					}else{
        						$("section>div.userPwd").show();
        					}
        				}
        			});
                    break;
                    
                //忘记密码取消
                case 'forgetCancel' :
                	alive.app.add.admin.program($(this) , '-1');
                	alive.ui.inputValTestAlertNone();
                    //console.log('点击取消按钮');
                    break;
                    
                  //修改密码取消
                case 'pwdCancel' :
                	alive.app.add.admin.program($(this) , '1');
                	alive.ui.inputValTestAlertNone();
                    //console.log('点击取消按钮');
                    break;
                    
                //重置密码
                case 'rePwd' :
                	pwdFlg=1;
                	var thisObj=$(this);
                    //console.log('点击重置密码按钮');
                	$.ajax({
            			type:"post",
            			url:"/smartHome_1/isAdmin",
            			data:"codeID="+codeid+"&openID="+openid+"&userID="+userid,
            			success:function(value) {
            				if(value == "error"){
            					$("a.alertMsg").html("您不是管理员，无权重置密码！");
            					alive.ui.popupShowHide();
            					return;
            				}else if(value == "admin"){
            					$.ajax({
                    				type:"post",
                    				url:"/smartHome_1/checkUserPwd", //查找用户
                    				data:"codeid="+codeid+"&userEmail="+$("#userEmail").val()+"&btnFlg=email&userid="+userid,
                    				success:function(value) {
                    					if(value == "equals"){
                    						alive.app.add.admin.program(thisObj , '-2');
                    						alive.ui.inputValTestAlertNone();
                    					}else{
                    						$("section>div.userEmail").show();
                    					}
                    				}
                    			});
            				}
            			}
            		});
                    
                    break;
                    
                //修改密码确认
                case 'pwdFinish' :
                    //console.log('点击修改密码确认按钮');
                    
                    $.ajax({
        				type:"post",
        				url:"/smartHome_1/checkUserPwd",
        				data:"codeid="+codeid+"&userPwd="+$("#oldPwd").val()+"&btnFlg=pwd&userid="+userid,
        				success:function(value) {
        					if(value == "equals"){
        						$("div.testAlert.oldPwd").hide();
        						$("section>svg.testOk.oldPwd").show();
        						if(CheckPwd($("#newPwd").val(),2)){
        							if($("#newPwd").val() != $("#newPwdTwice").val()){
        								$("section>div.newPwdTwice").show();
        								$("section>svg.testOk.newPwdTwice").hide();
            						}else{
            							$("a.alertMsg").html("修改成功！");
            							alive.ui.popupShowHide();
            							
            							var form = document.getElementById("addForm"); 
            							form.submit();
            						}
        						}
        					}else{
        						$("div.testAlert.oldPwd").show();
        						$("section>svg.testOk.oldPwd").hide();
        						$("div.testAlert.newPwd").hide();
        						$("section>svg.testOk.newPwd").hide();
        						$("section>div.newPwdTwice").hide();
								$("section>svg.testOk.newPwdTwice").hide();
        					}
        				}
        			});
                    
                    break;
                
                //授权按钮点击
                case 'allow' :
                    //console.log('点击授权按钮');
                    $("#userID").val(this.parentNode.parentNode.parentNode.id);
                    alive.ui.showPopup($("div#popup_allow_equipment"));//确认授权显示
                    break;
                    
                  //删除/取消授权按钮点击
                case 'del' :
                    //console.log('点击删除/取消授权按钮');
                    $("#userID").val(this.parentNode.parentNode.parentNode.id);
                    alive.ui.showPopup($("div#popup_del_equipment"));//确认删除/取消授
                    break;
                    
                default: false;	
            }
            
        });
    }
    
    // 退出管理页
    if($("div#popup_EQP_out").length > 0){
    	$(".popup_out").on("tap",function(){
    		WeixinJSBridge.call("closeWindow");
    	});
    }
	
    // 设置好初始密码 确认
	if($("div#popup_EQP_finish").length > 0){
		$("#popup_EQP_finish>section>a.popup_ok").on("tap",function(){
			var form = document.getElementById("addForm"); 
			form.submit();
		});
	}
	
	// 授权
	if($("div#popup_allow_equipment").length > 0){
		$("#popup_allow_equipment>section>a.allowOK").on("tap",function(){
			$.ajax({
				type:"post",
				url:"/smartHome_1/authorized",
				data:"userID="+$("#userID").val()+"&oFlg=1",
				success:function(value) {
					if(value == "ok"){
						alive.ui.hidePopup($("div#popup_allow_equipment"));
						alive.ui.mask.hideMask();
						// 点击授权后 显示已授权
						$(".allowThis"+$("#userID").val()).css("display","none");
						$(".isAllow"+$("#userID").val()).css("display","block");
					}
				}
			});
		});
	}
	
	// 取消授权
	if($("div#popup_del_equipment").length > 0){
		$("#popup_del_equipment>section>a.delOK").on("tap",function(){
			alive.ui.inputValTestAlertNone();
			$.ajax({
				type:"post",
				url:"/smartHome_1/delUser",
				data:"userID="+$("#userID").val(),
				success:function(value) {
					if(value == "ok"){
						alive.ui.hidePopup($("div#popup_del_equipment"));
						alive.ui.mask.hideMask();
						$("#"+$("#userID").val()).remove();
					}
				}
			});
		});
	}
	
	// 忘记密码
	$("#EQP_2>h1>div.forgetPwd").on("tap",function(){
		alive.app.add.admin.program($(this) , '1');
		alive.ui.inputValTestAlertNone();
	});
	
	// 用户列表
	$("#EQP_5>div>a.userList").on("tap",function(){
		alive.app.add.admin.program($(this) , '1');
		setTimeout(function(){
			$("div#goBack").show();
			alive.tools.rewriteScroll();
        },200);
	});
	
	// 修改密码
	$("#EQP_5>div>a.editPwd").on("tap",function(){
		var thisObj=$(this);
		$.ajax({
			type:"post",
			url:"/smartHome_1/isAdmin",
			data:"codeID="+codeid+"&openID="+openid+"&userID="+userid,
			success:function(value) {
				if(value == "error"){
					$("a.alertMsg").html("您无权修改密码！");
					alive.ui.popupShowHide();
					return;
				}else if(value == "admin"){
					alive.app.add.admin.program(thisObj , '-1');
					alive.ui.inputValTestAlertNone();
				}
			}
		});
	});
	
	// 进入XLINK
	$("#EQP_5>div>a.goXLink").on("tap",function(){
		if(gzhflag == "0") {
			window.location.href="/smartHome_1/smarthome/"+userid;
		} else{
			window.location.href="/smartHome_1/welcome/1-"+userid+"-"+openid;
		}
		
	});
	
	// 用户列表返回
	$("div#goBack").on("tap",function(){
		alive.app.add.admin.program($("#scroller") , '-1');
		setTimeout(function(){
			$("div#goBack").hide();
			alive.tools.rewriteScroll();
        },200);
		
	});
	
	// 密码正则
	function CheckPwd(pwd, flg){
		var filter = /^[\w]{6,18}$/;
		if (filter.test(pwd)) {
			if(flg == 1){
				$("section>div.initPwd").hide();
				$("section>svg.testOk.initPwd").show();
			}else{
				$("section>div.newPwd").hide();
				$("section>svg.testOk.newPwd").show();
			}
			return true;
		} else {
			if(flg == 1){
				$("section>div.initPwd").show();
				$("section>svg.testOk.initPwd").hide();
				$("section>div.twicePwd").hide();
				$("section>svg.testOk.twicePwd").hide();
				$("section>div.email").hide();
			}else{
				$("section>div.newPwd").show();
				$("section>svg.testOk.newPwd").hide();
				$("section>div.newPwdTwice").hide();
				$("section>svg.testOk.newPwdTwice").hide();
			}
			return false;
		};
	}
	
	// 邮箱正则
	function CheckMail(mail) {
		var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(mail)) {
			$("section>div.email").hide();
			$("section>svg.testOk.email").show();
			return true;
		} else {
			$("section>div.email").show();
			$("section>svg.testOk.email").hide();
			return false;
		}
	}
	
};

//初始化
alive.app.tv.btnCommand();//电视控制页面button按钮控制事件
alive.app.add.skip();//添加设备页面跳转APP
alive.app.add.popupBtn();//弹窗内部app
alive.app.add.admin();// 管理页
alive.tools.setDefault();//事件初始化
alive.ui.initializeIndex();//初始化各个标签
alive.ui.tapInputFocus();//初始化输入框tap事件获得焦点
alive.ui.touchBtnDefault();//按钮的默认触碰效果
alive.ui.asideBackHome();//内页返回主页按钮UI
alive.ui.asideSet();//内页设置按钮UI
alive.welecomeInfo();//欢迎页内容
alive.ui.voicePwdHelp();//语音识别
alive.ui.popupTimer();//定时
alive.ui.indexInfo();//初始化主页图标

$(document).ready(function(){
	alive.tools.loadedScroll();//IScroll初始化
	alive.app.longTapIndexList();//长按内容扩展
	alive.app.longBtn();//内页按钮长按
	alive.app.tapIndexList();//首页条目点击
	alive.app.indexBtnCommand();//主页button点击
	alive.app.addScene();//添加场景
	alive.app.tabChange();//标签切换
	alive.app.indexSwitch();//滑动开关
	alive.app.SceneSwitch();//场景定时开关
	alive.app.timePopupBtn();//定时  时 分 加减
	alive.app.voicePwd_3btn();//设置语音口令
	alive.app.contBtnEvent();//内页 灯 插座 按钮点击事件
	alive.app.add.addBtnEvent();// 引导页 按钮 发数据
	alive.app.setBtnEvent();//内页 引导按钮 发数据
	alive.app.add.btnPep();
	alive.app.arcValue();//空调进入时查询状态  
	_initialize();//主页标签初始化
});