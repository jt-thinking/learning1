### Commonjs 规范与实现的互为促进 Node.js / Couchdb 的发展

模块的分类

  核心模块
    http fs path

  文件模块
    var util = required('./util.js')

  第三方模块
	jsvar promise = require('bluebird')

####node.js 发展出了 io.js ..百度了一下,又合并了...


### URL 和 URI
  RUI 是 RUL 的子集
  
  有文字必须编码

#### url.parse(urlString[, parseQueryString[, slashesDenoteHost]])
  解析url为一个对象

#####urlString <string> 要解析的 URL 字符串。

#####parseQueryString <boolean> 如果为 true，则 query 属性总会通过 querystring 模块的 parse() 方法生成一个对象。 如果为 false，则返回的 URL 对象上的 query 属性会是一个未解析、未解码的字符串。 默认为 false。

#####slashesDenoteHost <boolean> 如果为 true，则 // 之后至下一个 / 之前的字符串会被解析作为 host。 例如，//foo/bar 会被解析为 {host: 'foo', pathname: '/bar'} 而不是 {pathname: '//foo/bar'}。 默认为 false。

#### url.format()
  解析一个对象为Url.刚好和parse方法相反

#### url.resolve()
  合并Url
    url.resolve('http://imooc.com/','/course/list') 
    result: http://imooc.com/course/list
  

### Query String

#### querystring.stringify(obj[, sep[, eq[, options]]])
  序列化

#### querystring.parse(str[, sep[, eq[, options]]])
  url解析为对象

#### querystring.escape('<哈哈>')
  转义 '%3C%E5%93%88%E5%93%88%3E'

#### querystring.unescape('%3C%E5%93%88%E5%93%88%3E')
  反转义 '<哈哈>'
    

### http协议 相关知识

#### http客户端发起请求,创建端口

#### http服务器在端口监听客户端请求

#### http服务器向客户端返回状态和内容
  TCP/IP 连接建立起来后,浏览器就可以向服务器发送HTTP请求了使用了比如说,用HTTP的get方法请求一个根域里的一个域名, 协议可以采HTTP 1.0 的一个协议

#### 请求过程
  1. Chrome搜索自身的DNS缓存
    chrome://net-internals/#dns
  2. 搜索操作系统自身的DNS缓存(浏览器没有找到缓存或缓存已经失效)
  3. 读取本地的HOST文件
  4. 浏览器发起一个DNS的一个系统调用请求(一般是宽带运营商提供)
    1.宽带运营商服务器查看本身缓存
    2.运营商服务器发起一个迭代DNS解析的请求
    ...
  5. 浏览器获得域名对应的IP地址后,发起HTTP'三次握手'
    TCP连接请求
  6. TCP/IP连接建立起来后,浏览器就可以向服务器发送HTTP请求了
  7. 服务器端接受到了这个请求,根据路径参数,经过后端的一些处理之后,把处理后的一个结果的数据返回给浏览器,如果是慕课网的页面就会把完整的HTML页面代码返回给浏览器
  8. 浏览器拿到了慕课网的完整的HTML页面代码,在解析和渲染这个页面的时候,里面的JS、CSS、图片静态资源,他们同样也是一个个HTTP请求都需要经过上面的主要的七个步骤
  9.浏览器根据拿到的资源对页面进行渲染,最终把一个完整的页面呈现给了用户

#### HTTP头和正文信息
  HTTP头发送的是一些附加的信息:内容类型服务器发送响应的日期、HTTP状态码

  正文就是用户提交的表单数据

### HTTP 概念进阶  进击Node.js 基础(一)5-6
  什么是回调?
  什么是同步/异步?
  什么是I/O?
  什么是单线程/多线程?
  什么是阻塞/非阻塞？
  什么是事件?
  什么是事件驱动?
  什么是基于事件驱动的回调?
  什么是事件循环?

### node.js是单线程,但是也有可以实现多线程的模块 
