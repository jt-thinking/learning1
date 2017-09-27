webpackJsonp([17],{

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(489)

var Component = __webpack_require__(50)(
  /* script */
  __webpack_require__(398),
  /* template */
  __webpack_require__(527),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/lifetea/anfast/audit-frontend/src/view/Com/Login.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Login.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5f686a6e", Component.options)
  } else {
    hotAPI.reload("data-v-5f686a6e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 398:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Vue) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _auth = __webpack_require__(89);

var _auth2 = _interopRequireDefault(_auth);

var _util = __webpack_require__(127);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports['default'] = {
    data: function data() {
        return {
            user: {
                jobNumber: '',
                password: ''
            },
            rules: {
                jobNumber: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm: function submitForm(formName) {
            var self = this;
            self.$refs[formName].validate(function (valid) {
                if (valid) {
                    //                        auth.login();
                    //localStorage.setItem('ms_username',self.ruleForm.username);
                    //                        self.$router.push('/index');
                    self.doLogin();
                } else {
                    //                        console.log('error submit!!');
                    return false;
                }
            });
        },
        doLogin: function doLogin() {
            var that = this;
            var user = that.user;
            var url = Vue.agent.root + '/login/signIn';
            var reqData = {
                jobNumber: user.jobNumber,
                password: _util2['default'].md5Encrypt(user.password)
            };

            that.$http.post(url, reqData, {
                timeout: 3000
            }).then(function (res) {
                if (res.body.code == "200") {
                    var _user = res.body.data;
                    _auth2['default'].login(_user);
                    _auth2['default'].setUser(_user);
                    that.doGetRole(function () {
                        that.$router.replace('/index-dashboad');
                    });
                } else {
                    that.$message.error(res.body.message);
                }
            });
        },
        doGetRole: function doGetRole(callback) {
            var that = this;
            var url = Vue.agent.root + '/role/selectUserFuncsOnlyOwn';
            var reqData = {
                userId: _auth2['default'].getUserId()
            };

            that.$http.get(url, { params: reqData }).then(function (res) {
                if (res.body.code == "200") {
                    var roles = res.body.data;
                    _auth2['default'].setRoles(roles);
                } else {
                    that.$message.error(res.body.message);
                }
                !!callback && callback();
            });
        }
    }

};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45)))

/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "\n.login-wrap {\n  background-color: #324157;\n  background-image: url(" + __webpack_require__(474) + ");\n  background-size: cover;\n}\n.plugins-tips {\n  background: #eef1f6;\n}\n.plugins-tips a {\n  color: #20a0ff;\n}\n.el-upload--text em {\n  color: #20a0ff;\n}\n.pure-button {\n  background: #20a0ff;\n}\n.login-wrap {\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n.ms-title {\n  margin: 0 auto;\n  height: 44px;\n  padding: 0 20px 2.6rem;\n  box-sizing: content-box;\n  color: #fff;\n}\n.ms-title .icon {\n    width: 80px;\n}\n.ms-title span {\n    font-weight: 500;\n    font-size: 1.8rem;\n    padding: 14px 0 0 24px;\n    letter-spacing: 2px;\n}\n.login-box {\n  position: absolute;\n  top: 40%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 300px;\n}\n.ms-login {\n  margin: 0 auto;\n  padding: 30px 30px 20px;\n  border-radius: 5px;\n  background: rgba(255, 255, 255, 0.61);\n}\n.ms-login .code {\n    height: 36px;\n    text-align: right;\n}\n.ms-login .code img {\n      height: 100%;\n}\n.login-btn {\n  text-align: center;\n}\n.login-btn .el-button--primary {\n    background: #51689f;\n    border-color: #51689f;\n    color: white;\n}\n.login-btn .el-button--primary:hover, .login-btn .el-button--primary:focus {\n      background: #5b70a2;\n      border-color: #5b70a2;\n}\n.login-btn .el-button--primary:active, .login-btn .el-button--primary.is-active {\n      background: #364772;\n      border-color: #364772;\n}\n.login-btn button {\n  width: 100%;\n  height: 36px;\n}\n.tips {\n  color: #51689f;\n  font-size: 12px;\n  line-height: 30px;\n}\n", ""]);

// exports


/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bg.43d94f.jpg";

/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo.f8ca71.png";

/***/ }),

/***/ 489:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(449);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(51)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-5f686a6e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/sass-loader/lib/loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-5f686a6e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/sass-loader/lib/loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "login-wrap"
  }, [_c('div', {
    staticClass: "login-box"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "ms-login"
  }, [_c('el-form', {
    ref: "user",
    staticClass: "demo-ruleForm",
    attrs: {
      "model": _vm.user,
      "rules": _vm.rules,
      "label-width": "0px"
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "jobNumber"
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "工号"
    },
    model: {
      value: (_vm.user.jobNumber),
      callback: function($$v) {
        _vm.user.jobNumber = $$v
      },
      expression: "user.jobNumber"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "prop": "password"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "password",
      "placeholder": "密码"
    },
    nativeOn: {
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.submitForm('user')
      }
    },
    model: {
      value: (_vm.user.password),
      callback: function($$v) {
        _vm.user.password = $$v
      },
      expression: "user.password"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-col', {
    attrs: {
      "span": 12
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "验证码"
    }
  })], 1), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 12
    }
  }, [_c('div', {
    staticClass: "code"
  }, [_c('img', {
    attrs: {
      "height": "36",
      "alt": "",
      "src": "https://passport.netease.im/czc/cregcp?&t=1489112941457"
    }
  })])])], 1), _vm._v(" "), _c('div', {
    staticClass: "login-btn"
  }, [_c('el-button', {
    staticClass: "el-button-login",
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.submitForm('user')
      }
    }
  }, [_vm._v("登录")])], 1), _vm._v(" "), _c('p', {
    staticClass: "tips"
  }, [_vm._v("Tips : 忘记密码联系管理员")])], 1)], 1)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ms-title"
  }, [_c('img', {
    staticClass: "icon",
    attrs: {
      "src": __webpack_require__(475)
    }
  }), _vm._v(" "), _c('span', [_vm._v("\n                信审管理系统\n            ")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5f686a6e", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=17.build.js.map