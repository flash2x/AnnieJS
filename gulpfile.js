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
var uiList=[
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
    var tsResult = gulp.src(coreList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        return tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildH5UI = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        target: "ES5",
        out: "annieUI.js"
    };
    var outDir = "buildH5";
    var tsResult = gulp.src(uiList).pipe(ts(op));
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
    var tsResult = gulp.src(coreList.concat(uiList.slice(1))).pipe(ts(op));
        return tsResult.js.pipe(gulp.dest(outDir));
};
var onBuildH5Last = function(){
    gulp.src(["buildH5/annieCore.js","buildH5/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("buildH5"));
    return gulp.src(["buildH5/annieCore.min.js","buildH5/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("buildH5"));
};
gulp.task('onBuildH5Core', onBuildH5Core);
gulp.task('onBuildH5UI', onBuildH5UI);
gulp.task("onBuildDoc", onBuildDoc);
gulp.task("onBuildH5Last", onBuildH5Last);
