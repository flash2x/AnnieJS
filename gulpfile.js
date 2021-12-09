/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat=require('gulp-concat');
var annieH5CoreList =[
    "annieH5/events/EventDispatcher.ts",
    "annieH5/events/Event.ts",
    "annieH5/events/MouseEvent.ts",
    "annieH5/events/TouchEvent.ts",
    "annieH5/geom/Point.ts",
    "annieH5/geom/Matrix.ts",
    "annieH5/geom/Rectangle.ts",
    "annieH5/utils/BlendMode.ts",
    "annieH5/display/DisplayObject.ts",
    "annieH5/display/bitmap.ts",
    "annieH5/display/Shape.ts",
    "annieH5/display/Sprite.ts",
    "annieH5/media/Media.ts",
    "annieH5/media/Sound.ts",
    "annieH5/media/Video.ts",
    "annieH5/display/MovieClip.ts",
    "annieH5/display/FloatDisplay.ts",
    "annieH5/display/TextField.ts",
    "annieH5/display/InputText.ts",
    "annieH5/display/Stage.ts",
    "annieH5/filters/Filters.ts",
    "annieH5/render/IRender.ts",
    "annieH5/render/CanvasRender.ts",
    "annieH5/render/OffCanvasRender.ts",
    "annieH5/net/URLLoader.ts",
    "annieH5/utils/Flash2x.ts",
    "annieH5/utils/Tween.ts",
    "annieH5/utils/Timer.ts",
    "annieH5/Annie.ts",
    "annieH5/GlobalFunction.ts"
];
var annieMinAppCoreList =[
    "annieMinApp/events/EventDispatcher.ts",
    "annieMinApp/events/Event.ts",
    "annieMinApp/events/MouseEvent.ts",
    "annieMinApp/events/TouchEvent.ts",
    "annieMinApp/geom/Point.ts",
    "annieMinApp/geom/Matrix.ts",
    "annieMinApp/geom/Rectangle.ts",
    "annieMinApp/display/DisplayObject.ts",
    "annieMinApp/display/bitmap.ts",
    "annieMinApp/display/Shape.ts",
    "annieMinApp/display/Sprite.ts",
    "annieMinApp/media/Sound.ts",
    "annieMinApp/display/MovieClip.ts",
    "annieMinApp/display/TextField.ts",
    "annieMinApp/display/Stage.ts",
    "annieMinApp/render/IRender.ts",
    "annieMinApp/render/CanvasRender.ts",
    "annieMinApp/render/OffCanvasRender.ts",
    "annieMinApp/net/URLLoader.ts",
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
    "annieMinGame/display/DisplayObject.ts",
    "annieMinGame/display/bitmap.ts",
    "annieMinGame/display/Shape.ts",
    "annieMinGame/display/Sprite.ts",
    "annieMinGame/media/Sound.ts",
    "annieMinGame/display/MovieClip.ts",
    "annieMinGame/display/TextField.ts",
    "annieMinGame/display/Stage.ts",
    "annieMinGame/render/IRender.ts",
    "annieMinGame/render/CanvasRender.ts",
    "annieMinGame/render/OffCanvasRender.ts",
    "annieMinGame/render/SharedCanvas.ts",
    "annieMinGame/utils/Flash2x.ts",
    "annieMinGame/utils/Tween.ts",
    "annieMinGame/utils/Timer.ts",
    "annieMinGame/Annie.ts",
    "annieMinGame/GlobalFunction.ts"
];
var annieNodeJSCoreList =[
    "annieNodeJS/events/EventDispatcher.ts",
    "annieNodeJS/events/Event.ts",
    "annieNodeJS/geom/Point.ts",
    "annieNodeJS/geom/Matrix.ts",
    "annieNodeJS/geom/Rectangle.ts",
    "annieNodeJS/display/DisplayObject.ts",
    "annieNodeJS/display/bitmap.ts",
    "annieNodeJS/display/Shape.ts",
    "annieNodeJS/display/Sprite.ts",
    "annieNodeJS/display/MovieClip.ts",
    "annieNodeJS/display/TextField.ts",
    "annieNodeJS/display/Stage.ts",
    "annieNodeJS/render/IRender.ts",
    "annieNodeJS/render/CanvasRender.ts",
    "annieNodeJS/render/OffCanvasRender.ts",
    "annieNodeJS/utils/Flash2x.ts",
    "annieNodeJS/utils/Tween.ts",
    "annieNodeJS/utils/Timer.ts",
    "annieNodeJS/Annie.ts",
    "annieNodeJS/GlobalFunction.ts"
];
var annieUIList=[
    "buildH5/annieCore.d.ts",
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
var onBuildH5Core = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "buildH5";
    var tsResult = gulp.src(annieH5CoreList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildH5Last = function(){
    gulp.src(["buildH5/annieCore.js","extendFiles/H5Extend.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildH5"));
    return gulp.src(["buildH5/annieCore.min.js","extendFiles/H5Extend.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildH5"));
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
    gulp.src(["extendFiles/minAppExtend2.js","buildUI/annieUI.js","extendFiles/minAppExtend3.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildMinApp"));
    gulp.src(["extendFiles/minAppExtend2.js","buildUI/annieUI.min.js","extendFiles/minAppExtend3.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildMinApp"));
    gulp.src(["buildMinApp/annieCore.js","extendFiles/minAppExtend1.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildMinApp"));
    return gulp.src(["buildMinApp/annieCore.min.js","extendFiles/minAppExtend1.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildMinApp"));
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
    gulp.src(["buildUI/annieUI.js","extendFiles/minGameExtend2.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildMinGame"));
    gulp.src(["buildUI/annieUI.min.js","extendFiles/minGameExtend2.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildMinGame"));
    gulp.src(["buildMinGame/annieCore.js","extendFiles/minGameExtend1.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildMinGame"));
    return gulp.src(["buildMinGame/annieCore.min.js","extendFiles/minGameExtend1.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildMinGame"));
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
    gulp.src(["buildUI/annieUI.js","extendFiles/nodeJSExtend2.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildNodeJS"));
    gulp.src(["buildUI/annieUI.min.js","extendFiles/nodeJSExtend2.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildNodeJS"));
    gulp.src(["buildNodeJS/annieCore.js","extendFiles/nodeJSExtend1.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildNodeJS"));
    return gulp.src(["buildNodeJS/annieCore.min.js","extendFiles/nodeJSExtend1.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildNodeJS"));
};
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
var onBuildDoc = function(){
    del([
        'libs'
    ]);
    var op = {
        noImplicitAny: true,
        declaration: true,
        target: "ES5"
    };
    var outDir = "libs";
    var tsResult = gulp.src(annieH5CoreList.concat(uiList.slice(1))).pipe(ts(op));
        return tsResult.js.pipe(gulp.dest(outDir));
};
gulp.task('onBuildUI', onBuildUI);
gulp.task('onBuildH5Core', onBuildH5Core);
gulp.task("onBuildH5Last", onBuildH5Last);
gulp.task('onBuildMinAppCore', onBuildMinAppCore);
gulp.task("onBuildMinAppLast", onBuildMinAppLast);
gulp.task('onBuildMinGameCore', onBuildMinGameCore);
gulp.task("onBuildMinGameLast", onBuildMinGameLast);
gulp.task('onBuildNodeCore', onBuildNodeCore);
gulp.task("onBuildNodeLast", onBuildNodeLast);
gulp.task("onBuildDoc", onBuildDoc);
