var alive = {};

alive.ui = {};

alive.ui.mask = {};
var oMask = $('body>mask');

//显示遮罩层
alive.ui.mask.showMask = function (zHeight) {
	//console.log('显示遮罩层');
	zHeight = typeof(zHeight) == 'undefined' ? 20 : zHeight;
	oMask.show();
	oMask.css('z-index', zHeight);
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

var aPopupSections = $('div.popup>section');

//初始化弹出窗口的位置
alive.ui.initializePopup = function (obj) {
	var oPopupSection = obj.children('section');
	var nHeight = oPopupSection.height();
	//console.log('弹出窗口高度为'+nHeight);
	oPopupSection.css('margin-top', parseInt(-nHeight / 2));
};

//显示弹出层
alive.ui.showPopup = function (obj, maskHeight, popupHeight) {
	if (typeof(popupHeight) !== 'undefined') {
		obj.css('z-index', popupHeight);
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

var aPopup = $('div.popup');

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
alive.ui.popupShowHide = function () {
	alive.ui.showPopup($("div#popup_alert"));
	setTimeout(function () {
		alive.ui.hidePopup($("div#popup_alert"));
		alive.ui.mask.hideMask();
	}, 1000);
};

//隐藏弹出层
alive.ui.hidePopup = function (obj) {
	obj.removeClass('popup_show');
	setTimeout(function () {
		obj.hide();
	}, 200);
	// hideMask() delete
};

var pwdFlg=0;
$('#test_btn').on('tap', function () {

	console.log('点击初始密码确认按钮');
	if (!CheckPwd($("#initPwd").val(), 1)) { //判断输入的初始密码 格式是否正确
		return false;
	}

	if ($("#initPwd").val() != $("#twicePwd").val()) {// 两次密码不一致
		$("section>div.twicePwd").show();
		$("section>svg.testOk.twicePwd").hide();
		$("section>div.email").hide();
		return false;
	} else {
		$("section>div.twicePwd").hide();
		$("section>svg.testOk.twicePwd").show();
	}
	if (pwdFlg != 1) {// 1 是重置密码 !=1 是初始密码
		if (!CheckMail($("#safeEmail").val())) { //验证邮箱格式
			return false;
		}
	}
	alive.ui.showPopup($("div#popup_EQP_finish"));// 全都正确后  弹框显示
});


// 密码正则
function CheckPwd(pwd, flg) {
	var filter = /^[\w]{6,18}$/;
	if (filter.test(pwd)) {
		if (flg == 1) {
			$("section>div.initPwd").hide();
			$("section>svg.testOk.initPwd").show();
		} else {
			$("section>div.newPwd").hide();
			$("section>svg.testOk.newPwd").show();
		}
		return true;
	} else {
		if (flg == 1) {
			$("section>div.initPwd").show();
			$("section>svg.testOk.initPwd").hide();
			$("section>div.twicePwd").hide();
			$("section>svg.testOk.twicePwd").hide();
			$("section>div.email").hide();
		} else {
			$("section>div.newPwd").show();
			$("section>svg.testOk.newPwd").hide();
			$("section>div.newPwdTwice").hide();
			$("section>svg.testOk.newPwdTwice").hide();
		}
		return false;
	}
	;
}

// 邮箱正则
function CheckMail(mail) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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

