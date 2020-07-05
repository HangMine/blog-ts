富文本编辑框记录

参考文档：
1、document.execCommand：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
2、selection：https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
3、range： https://developer.mozilla.org/zh-CN/docs/Web/API/Range
4、clipboardData：https://cloud.tencent.com/developer/article/1093605
5、别人踩坑记录：https://www.jianshu.com/p/924f8823ad34

问题记录：

0、现代编辑器可分为iframe设置designMode和普通DOM元素(如DIV)设置contentEditable属性两种方式
（1）iframe可使编辑内容样式隔离，避免受到原文档的样式影响
（2）contentEditable,浏览器兼容性差、用户行为难以控制
（3）如果兼容两者开发需要额外写很多兼容代码，代码量较大(但本次采用兼容开发)
（4）参考文档：https://blog.csdn.net/weixin_33901843/article/details/91368418

1、按钮的绑定事件用mouseDown而不是click

问题：用click无法获取到选中的内容
原因：根据鼠标事件的顺序，在click的时候，选中已取消
备注：鼠标事件的顺序:mouseDown->取消选中->mouseUp->click

2、剪切板的对象需兼容IE

备注：
（1）剪切板的对象需兼容IE：const clipboardData = e.clipboardData || (window as any).clipboardData;
（2）复制的内容都在clipboardData.items里，分为stirng(又分为text/plain和html/plain两种类型)和file两种类型
（3）string类型获取：item.getAsString((str:string)=>{})
（4）file类型获取：item.getAsFile()

3、如果使用iframe的方式，document对象要用iframe里面的document

4、默认编辑是div标签，考虑到语义化和默认样式，新段落统一用p标签，所以需要在初始化、enter、delete时添加<p><br></p>

5、粘贴默认保留样式，但是需要考虑图片的问题

清除样式：
（1）清除标签所有属性
（2）保留['href', 'src', 'width', 'height']属性，和style属性的width、height值

图片两种处理方案：
（1）转成base64（利用画布），统一提交（涉及图片跨域问题，需要服务端支持）
（2）每张照片都传到后台

6、预防xss攻击，使用xss库，以白名单的形式过滤html

