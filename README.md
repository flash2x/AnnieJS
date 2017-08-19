# AnnieJS(官方交流探讨QQ群:185090134)
## [AnnieJS 官网:http://www.annie2x.com](http://www.annie2x.com)
## [Flash2x 官网:http://www.flash2x.org](http://www.flash2x.org)
## [AnnieJS API文档:http://api.annie2x.com](http://api.annie2x.com) 
## [AnnieJS demo演示:http://test.annie2x.com](http://test.annie2x.com)
    AnnieJS 是一款专注于Html5 互动交互的2d动画引擎。
    AnnieJS 借助于Adobe Flash以及Flash2x工具将以前开发as3项目的工作流程完美复制到HTML5项目开发中来。
    AnnieJS 完全仿照as3的语法和架构，动画效果流畅,制作视觉震撼,但学习简单,安装方便！
    AnnieJS 支持ts和js两种开发语言环境，使用你熟悉的语言开发事半功倍。
    AnnieJS 最大的优势就是短小精悍。全部核心代码压缩后不到70k，该有的功能都有了。
    AnnieJS 需要结合Adobe 及 Flash2x工具使用才能发挥它最大的优势。
    Flash2x 是一款优秀的Adobe Flash插件,与AnnieJS无缝集成。
# 相比Flash自带的CreateJs有什么区别和优势
    不得不承认CreateJs非常的优秀，但是它当初不是以移动优先的原则设计的，大量的逻辑和判断代码针对移动端没有任何意义。
    CreateJs鼠标穿透非常让人头疼，上层的显示对象无法阻断事件会一直往下冒泡，非常讨厌。
    CreateJs鼠标事件也是非常让人头疼，如果你的按钮是有透明的地方或者说接近透明的地方，那么这个地方根本无法获取到鼠标事件
    CreateJs多fla项目制作打包，需要自己组织合成，资源压缩，打包还需要我们自己构建
    CreateJs对于交互式项目，核心库越小越好，显然CreateJs代码库有点过大
    那么AnnieJS的作者经过了长期使用CreateJs经验之后，做了大量的优化和工作才做出了现在的这款AnnieJS引擎
    重新定义了Flash开发H5的工作流程,具体优势各位看官接着往下看
# 使用前准备工作
    1.安装 Ant 或者 Gulp 构建工具，选一种你熟悉的就行
    2.如果使用typeScript开发，则需要安装 node.js typeScript 运行环境
    3.强烈推荐WebStorm，我们所有的源码和项目也是使用此工具制作
    4.安装Adobe Flash CS6 及以上版本
    5.强烈推荐google Chrome浏览器，调试利器
    6.下载并安装Flash2xManager管理软件,用此软件一健配置工具和引擎(支持Mac和win)
## [点击下载Flash2xManager工具](http://flash2x.org)
# 小试牛刀
    1.安装好以上所说的相关工具后，打开Adobe Flash软件 随便新建一个Fla文件制作些东西保存(一定要保存)。
    2.打开Flash的菜单->窗口->扩展(cs6是[其他])->Flash2x，这时就启动了我们的Flash2x工具。
    3.选择一个你熟悉的语言简单设置或者不需要任何设置，点击发布，直到提示发布成功。
    4.发布的项目在你使用的Fla文件的同目录下，用WebStorm打开此项目。这个很重要，如果发布后直接双击index.html是看不到任何效果的。
    5.如果是发布的TS语言项目，则需要在WebStorm下方的Terminal命令窗口输入 tsc,等待编译完成，再执行第6步。如果是js项目，则跳过这一步。
    6.在打开的webStorm项目里找到index.html 右键点击绿色三角箭头的按钮 Run'index.html'，就可以看到你的成果啦。
# 使用多fla来制作大型项目
## 经常一个大型项目不可能一个人全部做完，也不可能一个fla文件全部做完。那么Flash2x还支持多fla分开制作最后合成同一项目，使用起来也非常方便简单。
### 确定好开发语言后，大家应该都使用相同语言,如果对flash2x构架特别熟悉，也可以混合开发的那另说。开发大致分为两种情况。
#### A.一个人整合并制作步骤如下:
    1.将所有的制作好的fla文件放在同一个目录下
    2.用flash打开每个fla文件，在Flash2x工具面板里点击设置按钮，将各个fla的发布目录设置成同一目录名。
    3.点击Flash2x 面板的发布按钮，将所有的fla发布到你设置的目录里，但又不会相互干扰和覆盖
    4.针对不同模块进行相应的开发。
    5.通过Flash2x.loadScene进行分布加载或同时加载所有项目模块
    6.加上loading及其他代码。
    7.如果中途需要修改fla文件内容，则可以将相应fla文件给到动画师制作，完成后再覆盖回来发布就行。
    8.最后测试打包上线
#### B.多个人制作最给再给一个人整合步骤如下:
    1.各个fla开发人员在自己的电脑上发布项目，但所有人员都规定发布到命名相同的目录里。
    2.各个开发模块功能开发好之后，将fla及发布目录下的src目录和resource目录(如果是ts开发的则是resource 和tsSrc目录)发给整合人员
    3.整合人员将所有fla放在同一个目录下，并有fla目录下新建一个发布目录，发布目录名就是大家一致确定的目录名。
    4.将src目录和resource目录放入发布目录里。
    5.打开所有fla文件用Flash2x 工具重新发布一次。
    6.以下步骤和一个人整合并制作的步骤相同
# 打包压缩资源并发布成最终版
## 打包的构建工具目前支持两种，一种是Ant,一种是Gulp.
### A.Ant打包构建方案
    1.配置好Ant，并能全局使用。所谓的全局使用就是在命令终端只要输入ant三个字母，终端就会有相应的提示，这就表示全局安装成功。没有成功的百度下。
    2.在WebStorm里，一般在下面有个Terminal，打开它，在里面输入 'ant'，等待片刻，打包完成。
    3.打包完成后，会在项目目录里生成一个released目录，这个目录里的内容就是最终你可以发布出去的内容。
### B.Gulp打包构建方案
    1.配置好Glup,并能全局使用，什么是全局和Ant一样。
    2.在WebStorm里，打开Terminal 输入 'npm install'，这时会安装相应的node.js组件，等待安装完成
    3.安装完成后，在Terminal 输入 'gulp' 打包将会进行。
    4.如果打包的过程中出现错误，一般是项目目录下的tools文件夹没有执行权限，更改一下tools的目录执行权限，再次运行 'gulp'
    5.打包完成后，会在项目目录里生成一个released目录，这个目录里的内容就是最终你可以发布出去的内容。
### 在手机上调出vConsole调试面板查看调试信息
    在main.js或者main.ts中将'annie.debug=false;'设成 'annie.debug=true;'
# 如何更新引擎及工具
    下载的Falsh2xManager管理软件不要删除了，引擎及工具的更新和升级都需要用到，长期保留会有惊喜。
# AnnieJS 版本更新列表
## AnnieJS 1.1.2 版本
    无限期去掉webGl的支持，对2d交互支持不成熟，反正我是这么认为了
    删除annie.ImageFrame类,使用有缺陷
    删除annie.VideoPlayer类,使用有缺陷
    修复获取宽高不准的bug
    修复的annie.Shape类的鼠标或者触摸区域有误差导致明明点到边界上了确没有触发鼠标或者触摸事件的bug
    修复导出静态，动态，输入文本会前后上下少2像素导致单行变多行的bug
    修复Flash2x.LoadScene()加载一个场景中断后再次加载报错的bug
    修复在annie.Event.ADD_TO_STAGE事件里调整stage.scaleMode后调用stage.resize()无效的bug
    修复使用annie.Tween.from方法时,被tween对象开始转换属性时会跳跃的Bug
    增加MouseEvent.identifier属性以方便在多手指触摸时更精准获取相关MouseEvent事件
    增加将Sprite类缓存为位图功能
    增加直接对FloatDisplay元素使用annie.MouseEvent鼠标事件
    优化渲染结构
## AnnieJS 1.1.1 版本
    修复annie.Tween偶尔kill的时候会kill到其他tween对象的bug
    修复annieUI.SlidePage在Android机上滑动困难的bug
    修复在父级和子级都侦听了REMOVE_TO_STAGE事件时，并在事件回调里都执行了removeChild的相关方法会导致子级的REMOVE_TO_STAGE事件被多次调用的bug
    优化annieUI.FilpBook类的相关方法及用法
    优化annie.Shape类的矢量渲染
    优化annieUI.ScrollPage和annieUI.ScorllList
    优化annie.Tween在对同一对象多次执行annie.Tween效果时，最新的tween只会替换掉与之前tween中对象相同的属性，而不是全部覆盖
    增加获取舞台区域的像素数据，注意舞台所在的canvas不得被污染
    增加annie.Sound.stopAllSounds()方法来停止当前播放的声音。
    增加annie.Sound.setAllSoundsVolume()方法来设置所有播放或未播放的已经被加载到项目中的声音音量
    增加annieUI.ScorllPage2个事件annie.Event.ON_SCROOL_START annie.Event.ON_SCROOL_TO_STOP
    增加了annieUI.ScrollList类列表类，支持多列
    增加了annieUI.DrawingBoard画板类，支持撤销
    增加了annieUI.ScratchCard刮刮卡类，支持获取刮取面积的百分比
    修改annieUI.ScorllPage中annie.Event.ON_SCROOL_TO_START事件为annie.Event.ON_SCROOL_TO_HEAD
## AnnieJS 1.1.0 版本
    修复矢量元素加滤镜无效的bug
    修复annie.Tween中以秒为计算单位时,delay参数仍然以帧为单位的bug
    修复annie.Timer使用时用户不使用kill杀死Timer对象导致内存泄漏报错的bug
    修复首次添加显示对象到舞台时，偶尔会出现残影的bug
    修复开启多点手势后，在pc端打开时报错而需要刷新后才正常的bug
    修复初始化annie.Bitmap时设置宽高无效的bug
    新增annie.TextInput的maxCharacters最长字段属性
    新增annie.Event中一些静态事件常量
    新增annie.Shape的像素碰撞，默认开启.属性名为:hitTestWidthPixel
    新增annie.Bitmap的像素碰撞，默认未开启.属性名为:hitTestWidthPixel
    重写annieUI.SlidePage类，使其更加完善和优化
    更改默认关闭旋转和默认禁止调整stage尺寸
## AnnieJS 1.0.9 版本
    修复annie.Shape画线在手机端会报错的bug
    修复annie.Shape在不缓存成位置下的点击区域失效的bug
    修复annie.TextField多行默认值为空时报错的bug
    修复annie.URLLoader加载Image后获取宽高为0的bug
    修复annie.Bitmap设置bitmapData为null时渲染报错的bug
    修复annie.MouseEvent onMouseOver onMouseOut 偶尔会不触发的bug
    修复Flash2x.jsonp不能同时调用多次的bug
    修复再次Flash2x.loadScene同一场景时报错的bug
    修复矢量位置填充初次渲染失效的bug
    修复annie.MovieClip中代码跳帧操作或者其他操作更新子级的transform相关属性时偶尔会有残影的bug
    修复annie.DisplayObject渲染刷新优化无效的bug
    修复annie.FloatDisplay，annie.InputText在横屏情况下旋转会失效的bug
    修复annieUI.SlidePage类设置横向滑动失效的问题
    修复在子级里有FloatDisplay相关类对象时，设置父级的visible或者父级的alpha为0里，floatDisplay对象不能隐藏的bug
    优化按钮元件鼠标按下后的状态，以前是按下后固定跳到第二个状态。现在优化成如果有第三个状态，则跳到第三个，没有的话再跳到第二个
    新增了annie.Timer类
    新增了annie.MouseEvent和annie.TouchEvent的updateAfterEvent方法
    新增了annieUI.ScrollList类
    新增Flash2x.getQueryString方法以获取url上的参数值
    新增annie.Stage.isPreventDefaultEvent 属性，以方便AnnieJS设置是否阻止页面的触摸或者鼠标默认事件行为
## AnnieJS 1.0.8 版本
    如果是老版本项目升级上来的，请将index.html头部样式表里加上'height:100%'
    支持引擎在多个流行APP中的Html5环境下运行
    修复横屏项目在部分手机无法横屏显示的bug
    修复qq浏览器声音播放有时无法循环的bug
    修复将一个child从一个父级直接添加到另一个父级时位置不更新的bug
    优化在手机淘宝，手机qq，手机微博，手机微信以及手机浏览器上的整体兼容性
    优化鼠标或者触摸事件，基本同步原生事件.特别是对不支持自动播放音乐的浏览器需要侦听事件时特别有用。
    优化移动端多个手指点击不同的对象都能正确触发相应的触摸事件而不再相互混淆冲突
## AnnieJS 1.0.7 版本
    优化MovieClip类结构
    修复hasEventListener有时不准确的bug
    修复化ULRLoader加载声音后在某些手机最小化时项目闪退的bug
    优化底层结构
## AnnieJS 1.0.6 版本
    修复EnterFrame事件中更新显示对象属性无效的bug
    修复动画元件设置滤色效果后，在动画的情况下失灵的bug
    修复矢量位图填充元件在有些动画情况下视觉错乱的bug
    更改URLLoader加载声音时的返回类型，现在直接返回为annie.Sound类型，以前返回的是html声音标签
    更改URLLoader加载视频时的返回类型，现在直接返回为annie.Video类型，以前返回的是html视频标签
    重新支持webgl
    支持动态文本设置边框属性
    支持矢量线条设置末端形状及拼接形状属性设置
    优化底层结构
## AnnieJS 1.0.5 版本
    新增 annie.Sprite 一个属性 isCacheShape 以此来控制对应容器中是否要缓存矢量为位图，并提高精确的鼠标点击
    修复手动调用stage.resize()后，stage显示区域显示错误的bug
    修复打包成swf后，如果Flash2x.loadScene第四个参数设置路径后加载报错的问题
    修复annie.toDisplayDataURL方法截图不准确的bug
    修复annieUI.FacePhoto在不是正方形情况下显示有误的bug
    修复获取显示对象的width height属性值时偶尔会不准确的bug
    修复输入文本设置成加粗，斜体发布时报错的bug
## AnnieJS 1.0.4 版本
    优化annie.URLLoader 错误事件提示
    增加annie.URLLoader 加载完整事件里返回加载数据类型参数
    修复annie.VideoPlayer 播放mp4报错问题
    优化video在微信的播放效果
    修复annie.DisplayObject.getDrawRect在没有子集的情况下返回null
    新增Flash2x.jsonp()方法
    重写显示对象的update的算法，大量优化，效率提高200%
    矢量不再默认缓存为位图，需要手动设置annie.Shape实例的cacaheAsBitmpa属性开启
    暂时去掉对webgl的支持，在2d交互项目使用过程中目前没发现有什么突飞猛进的作用，实用性和性价比不高，反而增加了引擎体积，等webgl成熟后再支持
## AnnieJS 1.0.3 版本
    删除annie.canTouchMove,不再控制html的可移动所有浮在AnnieJS上的Html元素自己管自己,现在canvas本身是不会上下滑动的了
    增加支持输入文本在手机端自动回收软键盘
    增加支持两点的放大缩小及旋转手势
    增加了anneUIFlipPage电子杂志组件
    修复annie.URLLoader上传超时没反应的bug
    修复annie.Point.distance()计算错误bug
    修复android机annie.MouseEvent.CLICK事件不灵敏的bug
    修复将一个子对象添加到另一个子对象时，子对象里所有动画信息会被初始化的bug
    阻止手机双击屏幕时,界面会往上弹起效果
    废弃annie.AObject.getInstanceId()方法，直接使用annie.AObject.instanceId属性获取或则设置
    废弃annie.DisplayObject.getWH()和annie.DisplayObject.setWH()方法，直接使用annie.DisplayObject.width和annie.DisplayObject.height属性进行获取和设置
    废弃annie.InputText.getText()和annie.DisplayObject.setText()方法，直接使用annie.InputText.text属性进行获取和设置
    废弃annie.InputText.setBorder()，直接使用annie.InputText.border 属性进行获取和设置
    废弃annie.InputText.setBold()，直接使用annie.InputText.bold 属性进行获取和设置
    废弃annie.InputText.setItalic()，直接使用annie.InputText.italic 属性进行获取和设置
    增加annie.InputText.color 属性进行字体颜色的获取和设置
    增加annie.AObject.instanceType 属性进行获取对象类型
    增加Flash2x.loadScene()的完成时回调参数。在加载多场景的时候很有用，比如有些时候，我不想等所有的场景加载完才运行，这样我可以通过完成时回调参数来判断加载到哪里了。
    进一步优化引擎内核
## AnnieJS 1.0.2 版本
    新增annie.MoveClip类中的container属性，方便对MovieClip中添加不是用fla生成的子级对象
    支持WEBGL渲染，提高渲染性能。
    但不能迷恋WEBGL，还是需要看应用情景,偏大量交互动画长篇建议用Canvas渲染;一般交互项目或者偏游戏类型的项目建议用WEBGL。具体性能可实地测试项目后再来定夺
    修复动态文本一开始就用数字赋值不显示的问题
    优化加载模块，提高加载速度
    修复在微信环境里某些手机音乐不能自动播放的问题
    修复矢量位图填充在不使用spriteSheet的情况下时无法找到位置资源的bug
    增加annie.Tween 中的完成回调参数
    增加annie.Tween 中的loop循环参数
    增加annie.Rectangle 中testRectCross方法 检测矩形相交
    进一步优化引擎内核
## AnnieJS 1.0.1 版本更新列表
    修复静态文本多行显示不正确bug
    URLLoader支持泛型跨域
    修复了Tween中的两个命名不规范的静态缓动方法名
    修复annieUI.ScrollPage 在pc端鼠标不按下就能滚动的bug
    修复annie.Tween 在动画完成回调函数里继续更改同一对象的动画效果时会无效的bug
    将annie.Shape.arc方法的参数由弧度更改成角度
    支持vconsole调试，这样在手机上测试的时候就可以查看到调试信息(非常有用)
    更改了鼠标事件执行顺序，以前是在渲染前,现在更改后渲染后,逻辑更合理
## AnnieJS 1.0.0 版本
    支持flash 剪辑,动画剪辑，按钮,文本，矢量，图形,SpriteSheet，声音等对象
    支持flash 遮罩，引导，传统补间，高级补间，骨骼动画
    支持Flash 模糊，发光，投影，高级色彩，变色滤镜
    支持Flash 显示对象的x,y,alpha,rotation,visible,scaleX,scaleY,skewX,skewY,anchorX,anchorY
    支持Flash 时间轴嵌套时间轴动画，多层，多帧，多子级动画
    支持Flash 时间轴的正向播放，反向播放
    支持Flash 时间轴跳转标签
    支持Flash 时间轴EnterFrame事件，EndFrame事件，CallFrame事件
    支持Flash 时间轴上运行的脚本
    支持Flash 矢量的单色填充，渐变线性填充，渐变径向填充，位图填充
    支持Flash Stage缩放自适应，自适应设备方向，resize事件
    支持Flash mouse的mouseDown mouseUp mouseOver mouseMove click 事件
    支持Flash 显示对象的 addToStage removeToStage 事件
    支持Flash 显示对象的 mouseChildren mouseEabale属性
    支持tween 动画类
    支持urlLoader 加载类
    支持flash2x 管理类
# Flash2x 版本更新列表
## Flash2x 3.1.0
    支持AnnieJS导出输入文本的maxCharacters属性，以限制最大输入字符数
    修复fla文件命名为main.fla后gulp打包成swf报错的bug
    修复f2xShare资源gulp打包成swf后并不重复里利用的bug
    增加在导出时将矢量对象转换为图片的功能选择
    增加在导出时将静态文本转换为图片的功能选择
## Flash2x 3.0.8
    修复导出复杂矢量时报错的bug
    修复导出特殊字符时报错的bug
## Flash2x 3.0.7
    持导出Egret相关引擎
## Flash2x 3.0.6
    修复静态文本多行时只导出第一行的bug
    支持动态文本边框导出
    支持导出LayaBox相关引擎
    修复导出文本时有双引号会报错的bug
    修复在animate cc 2017中导出中英数混全文本时导出不全的bug
## Flash2x 3.0.5
    少量优化导出结构
## Flash2x 3.0.4
    更新gulp构建模式下支持将fla打包成一个单独的swf资源文件供html5调用，实现一个fla生成一个swf文件别无其他资源文件的完美解决方案
## Flash2x 3.0.3
    更新AnnieJS引擎及相应的模板包
## Flash2x 3.0.2
    支持Flash Canvas 文档导出
    增加对单帧的动画剪辑的时间轴上的代码脚本导出
## Flash2x 3.0.1
    修复导出矢量图时偶尔报错的bug
    修复多行静态文本导出后只显示一行的bug
    修复了清除缓存模式下Main.js没有被清除缓存的bug
    修复导出序列视频annie.ImageVideo会抖动的bug
## Flash2x 3.0.0
    支持将flash以上所提到的资源和功能导出，以提供给AnnieJS引擎使用。
    支持自定义开发功能，给需要想导出成其他引擎的开发者开发使用。