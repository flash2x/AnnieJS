/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat=require('gulp-concat');
var annieMinAppCoreList =[
    "annieMinApp/events/EventDispatcher.ts",
    "annieMinApp/events/Event.ts",
    "annieMinApp/events/MouseEvent.ts",
    "annieMinApp/events/TouchEvent.ts",
    "annieMinApp/geom/Point.ts",
    "annieMinApp/geom/Matrix.ts",
    "annieMinApp/geom/Rectangle.ts",
    // "annieMinApp/utils/BlendMode.ts",
    "annieMinApp/display/DisplayObject.ts",
    "annieMinApp/display/bitmap.ts",
    "annieMinApp/display/Shape.ts",
    "annieMinApp/display/Sprite.ts",
    // "annieMinApp/media/Media.ts",
    "annieMinApp/media/Sound.ts",
    // "annieMinApp/media/Video.ts",
    //"annieMinApp/media/ImageFrames.ts",
    "annieMinApp/display/MovieClip.ts",
    // "annieMinApp/display/FloatDisplay.ts",
    //"annieMinApp/display/VideoPlayer.ts",
    "annieMinApp/display/TextField.ts",
    // "annieMinApp/display/InputText.ts",
    "annieMinApp/display/Stage.ts",
    // "annieMinApp/filters/Filters.ts",
    "annieMinApp/render/IRender.ts",
    "annieMinApp/render/CanvasRender.ts",
    "annieMinApp/render/OffCanvasRender.ts",
    // "annieMinApp/net/URLLoader.ts",
    "annieMinApp/utils/Flash2x.ts",
    "annieMinApp/utils/Tween.ts",
    "annieMinApp/utils/Timer.ts",
    "annieMinApp/Annie.ts",
    "annieMinApp/GlobalFunction.ts"
];
var annieMinGameCoreList =[
    "annieMinGame/events/EventDispatcher.ts",
    "annieMinGame/events/Event.ts",
    "annieMinGame/events/MouseEvent.ts",
    "annieMinGame/events/TouchEvent.ts",
    "annieMinGame/geom/Point.ts",
    "annieMinGame/geom/Matrix.ts",
    "annieMinGame/geom/Rectangle.ts",
    // "annieMinGame/utils/BlendMode.ts",
    "annieMinGame/display/DisplayObject.ts",
    "annieMinGame/display/bitmap.ts",
    "annieMinGame/display/Shape.ts",
    "annieMinGame/display/Sprite.ts",
    // "annieMinGame/media/Media.ts",
    "annieMinGame/media/Sound.ts",
    // "annieMinGame/media/Video.ts",
    //"annieMinGame/media/ImageFrames.ts",
    "annieMinGame/display/MovieClip.ts",
    // "annieMinGame/display/FloatDisplay.ts",
    //"annieMinGame/display/VideoPlayer.ts",
    "annieMinGame/display/TextField.ts",
    // "annieMinGame/display/InputText.ts",
    "annieMinGame/display/Stage.ts",
    // "annieMinGame/filters/Filters.ts",
    "annieMinGame/render/IRender.ts",
    "annieMinGame/render/CanvasRender.ts",
    "annieMinGame/render/OffCanvasRender.ts",
    "annieMinGame/render/SharedCanvas.ts",
    // "annieMinGame/net/URLLoader.ts",
    "annieMinGame/utils/Flash2x.ts",
    "annieMinGame/utils/Tween.ts",
    "annieMinGame/utils/Timer.ts",
    "annieMinGame/Annie.ts",
    "annieMinGame/GlobalFunction.ts"
];
var annieNodeJSCoreList =[
    "annieNodeJS/events/EventDispatcher.ts",
    "annieNodeJS/events/Event.ts",
    // "annieNodeJS/events/MouseEvent.ts",
    // "annieNodeJS/events/TouchEvent.ts",
    "annieNodeJS/geom/Point.ts",
    "annieNodeJS/geom/Matrix.ts",
    "annieNodeJS/geom/Rectangle.ts",
    // "annieNodeJS/utils/BlendMode.ts",
    "annieNodeJS/display/DisplayObject.ts",
    "annieNodeJS/display/bitmap.ts",
    "annieNodeJS/display/Shape.ts",
    "annieNodeJS/display/Sprite.ts",
    // "annieNodeJS/media/Media.ts",
    // "annieNodeJS/media/Sound.ts",
    // "annieNodeJS/media/Video.ts",
    //"annieNodeJS/media/ImageFrames.ts",
    "annieNodeJS/display/MovieClip.ts",
    // "annieNodeJS/display/FloatDisplay.ts",
    //"annieNodeJS/display/VideoPlayer.ts",
    "annieNodeJS/display/TextField.ts",
    // "annieNodeJS/display/InputText.ts",
    "annieNodeJS/display/Stage.ts",
    // "annieNodeJS/filters/Filters.ts",
    "annieNodeJS/render/IRender.ts",
    "annieNodeJS/render/CanvasRender.ts",
    "annieNodeJS/render/OffCanvasRender.ts",
    // "annieNodeJS/render/SharedCanvas.ts",
    // "annieNodeJS/net/URLLoader.ts",
    "annieNodeJS/utils/Flash2x.ts",
    "annieNodeJS/utils/Tween.ts",
    "annieNodeJS/utils/Timer.ts",
    "annieNodeJS/Annie.ts",
    "annieNodeJS/GlobalFunction.ts"
];
var annieUIList=[
    "buildMinApp/annieCore.d.ts",
    "annieUI/Scroller.ts",
    "annieUI/MCScroller.ts",
    "annieUI/ScrollPage.ts",
    "annieUI/ScrollList.ts",
    "annieUI/FacePhoto.ts",
    "annieUI/SlidePage.ts",
    "annieUI/FlipBook.ts",
    "annieUI/DrawingBoard.ts",
    "annieUI/ScratchCard.ts"
];
var onBuildUI = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        target: "ES5",
        out: "annieUI.js"
    };
    var outDir = "buildUI";
    var tsResult = gulp.src(annieUIList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildMinAppCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "buildMinApp";
    var tsResult = gulp.src(annieMinAppCoreList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};

var onBuildMinAppLast = function(){
    gulp.src(["buildMinApp/add2.js","buildUI/annieUI.js","buildMinApp/add3.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildMinApp"));
    gulp.src(["buildMinApp/add2.js","buildUI/annieUI.min.js","buildMinApp/add3.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildMinApp"));
    gulp.src(["buildMinApp/annieCore.js","buildMinApp/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildMinApp"));
    return gulp.src(["buildMinApp/annieCore.min.js","buildMinApp/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildMinApp"));
};
var onBuildMinGameCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "buildMinGame";
    var tsResult = gulp.src(annieMinGameCoreList).pipe(ts(op));
    tsResult.dts.pipe(gulp.dest(outDir));
    return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildMinGameLast = function(){
    gulp.src(["buildUI/annieUI.js","buildMinGame/add2.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildMinGame"));
    gulp.src(["buildUI/annieUI.min.js","buildMinGame/add2.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildMinGame"));
    gulp.src(["buildMinGame/annieCore.js","buildMinGame/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildMinGame"));
    return gulp.src(["buildMinGame/annieCore.min.js","buildMinGame/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildMinGame"));
};
var onBuildNodeCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "buildNodeJS";
    var tsResult = gulp.src(annieNodeJSCoreList).pipe(ts(op));
    tsResult.dts.pipe(gulp.dest(outDir));
    return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};

var onBuildNodeLast = function(){
    gulp.src(["buildUI/annieUI.js","buildNodeJS/add2.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildNodeJS"));
    gulp.src(["buildUI/annieUI.min.js","buildNodeJS/add2.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildNodeJS"));
    gulp.src(["buildNodeJS/annieCore.js","buildNodeJS/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildNodeJS"));
    return gulp.src(["buildNodeJS/annieCore.min.js","buildNodeJS/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildNodeJS"));
};
gulp.task('onBuildUI', onBuildUI);
gulp.task('onBuildMinAppCore', onBuildMinAppCore);
gulp.task("onBuildMinAppLast", onBuildMinAppLast);
gulp.task('onBuildMinGameCore', onBuildMinGameCore);
gulp.task("onBuildMinGameLast", onBuildMinGameLast);
gulp.task('onBuildNodeCore', onBuildNodeCore);
gulp.task("onBuildNodeLast", onBuildNodeLast);
