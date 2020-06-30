/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat=require('gulp-concat');
var coreList =[
    "annie/events/EventDispatcher.ts",
    "annie/events/Event.ts",
    "annie/events/MouseEvent.ts",
    "annie/events/TouchEvent.ts",
    "annie/geom/Point.ts",
    "annie/geom/Matrix.ts",
    "annie/geom/Rectangle.ts",
    // "annie/utils/BlendMode.ts",
    "annie/display/DisplayObject.ts",
    "annie/display/bitmap.ts",
    "annie/display/Shape.ts",
    "annie/display/Sprite.ts",
    // "annie/media/Media.ts",
    "annie/media/Sound.ts",
    // "annie/media/Video.ts",
    //"annie/media/ImageFrames.ts",
    "annie/display/MovieClip.ts",
    // "annie/display/FloatDisplay.ts",
    //"annie/display/VideoPlayer.ts",
    "annie/display/TextField.ts",
    // "annie/display/InputText.ts",
    "annie/display/Stage.ts",
    // "annie/filters/Filters.ts",
    "annie/render/IRender.ts",
    "annie/render/CanvasRender.ts",
    "annie/render/OffCanvasRender.ts",
    // "annie/net/URLLoader.ts",
    "annie/utils/Flash2x.ts",
    "annie/utils/Tween.ts",
    "annie/utils/Timer.ts",
    "annie/Annie.ts",
    "annie/GlobalFunction.ts"
];
var uiList=[
    "build/annieCore.d.ts",
    "annie/ui/Scroller.ts",
    "annie/ui/MCScroller.ts",
    "annie/ui/ScrollPage.ts",
    "annie/ui/ScrollList.ts",
    "annie/ui/FacePhoto.ts",
    "annie/ui/SlidePage.ts",
    "annie/ui/FlipBook.ts"
    // "annie/ui/DrawingBoard.ts",
    // "annie/ui/ScratchCard.ts"
];
var coreGameList =[
    "annieGame/events/EventDispatcher.ts",
    "annieGame/events/Event.ts",
    "annieGame/events/MouseEvent.ts",
    "annieGame/events/TouchEvent.ts",
    "annieGame/geom/Point.ts",
    "annieGame/geom/Matrix.ts",
    "annieGame/geom/Rectangle.ts",
    // "annieGame/utils/BlendMode.ts",
    "annieGame/display/DisplayObject.ts",
    "annieGame/display/bitmap.ts",
    "annieGame/display/Shape.ts",
    "annieGame/display/Sprite.ts",
    // "annieGame/media/Media.ts",
    "annieGame/media/Sound.ts",
    // "annieGame/media/Video.ts",
    //"annieGame/media/ImageFrames.ts",
    "annieGame/display/MovieClip.ts",
    // "annieGame/display/FloatDisplay.ts",
    //"annieGame/display/VideoPlayer.ts",
    "annieGame/display/TextField.ts",
    // "annieGame/display/InputText.ts",
    "annieGame/display/Stage.ts",
    // "annieGame/filters/Filters.ts",
    "annieGame/render/IRender.ts",
    "annieGame/render/CanvasRender.ts",
    "annieGame/render/OffCanvasRender.ts",
    "annieGame/render/SharedCanvas.ts",
    // "annieGame/net/URLLoader.ts",
    "annieGame/utils/Flash2x.ts",
    "annieGame/utils/Tween.ts",
    "annieGame/utils/Timer.ts",
    "annieGame/Annie.ts",
    "annieGame/GlobalFunction.ts"
];
var uiGameList=[
    "build/annieCore.d.ts",
    "annieGame/ui/Scroller.ts",
    "annieGame/ui/MCScroller.ts",
    "annieGame/ui/ScrollPage.ts",
    "annieGame/ui/ScrollList.ts",
    "annieGame/ui/FacePhoto.ts",
    "annieGame/ui/SlidePage.ts",
    "annieGame/ui/FlipBook.ts"
    // "annieGame/ui/DrawingBoard.ts",
    // "annieGame/ui/ScratchCard.ts"
];
var onBuildCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "build";
    var tsResult = gulp.src(coreList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildUI = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        target: "ES5",
        out: "annieUI.js"
    };
    var outDir = "build";
    var tsResult = gulp.src(uiList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildLast = function(){
    gulp.src(["build/add2.js","build/annieUI.js","build/add3.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("build"));
    gulp.src(["build/add2.js","build/annieUI.min.js","build/add3.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("build"));
    gulp.src(["build/annieCore.js","build/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("build"));
    return gulp.src(["build/annieCore.min.js","build/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("build"));
};
var onBuildGameCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js",
        target: "ES5"
    };
    var outDir = "buildGame";
    var tsResult = gulp.src(coreGameList).pipe(ts(op));
    tsResult.dts.pipe(gulp.dest(outDir));
    return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildGameUI = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        target: "ES5",
        out: "annieUI.js"
    };
    var outDir = "buildGame";
    var tsResult = gulp.src(uiGameList).pipe(ts(op));
    tsResult.dts.pipe(gulp.dest(outDir));
    return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildGameLast = function(){
    gulp.src(["buildGame/annieUI.js","buildGame/add2.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("buildGame"));
    gulp.src(["buildGame/annieUI.min.js","buildGame/add2.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("buildGame"));
    gulp.src(["buildGame/annieCore.js","buildGame/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildGame"));
    return gulp.src(["buildGame/annieCore.min.js","buildGame/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildGame"));
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
    var tsResult = gulp.src(coreList.concat(uiList.slice(1))).pipe(ts(op));
    return tsResult.js.pipe(gulp.dest(outDir));
};
gulp.task('onBuildCore', onBuildCore);
gulp.task('onBuildUI', onBuildUI);
gulp.task("onBuildLast", onBuildLast);
gulp.task('onBuildGameCore', onBuildGameCore);
gulp.task('onBuildGameUI', onBuildGameUI);
gulp.task("onBuildGameLast", onBuildGameLast);
gulp.task("onBuildDoc", onBuildDoc);
