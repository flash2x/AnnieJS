/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var coreList =[
    "annie/events/EventDispatcher.ts",
    "annie/events/Event.ts",
    "annie/events/MouseEvent.ts",
    "annie/events/TouchEvent.ts",
    "annie/geom/Point.ts",
    "annie/geom/Matrix.ts",
    "annie/geom/Rectangle.ts",
    "annie/display/DisplayObject.ts",
    "annie/display/bitmap.ts",
    "annie/display/Shape.ts",
    "annie/display/Sprite.ts",
    "annie/display/MovieClip.ts",
    "annie/display/TextField.ts",
    "annie/display/Stage.ts",
    "annie/display/Sound.ts",
    //"annie/filters/Filters.ts",
    "annie/render/IRender.ts",
    "annie/render/CanvasRender.ts",
    "annie/utils/Tween.ts",
    "annie/utils/Timer.ts",
    "annie/utils/Flash2x.ts",
    "annie/Annie.ts",
    "annie/GlobalFunction.ts"
];
var uiList=[
    "annie/ui/ScrollPage.ts",
    "annie/ui/SlidePage.ts",
    "annie/ui/FlipBook.ts",
    "annie/ui/ScrollList.ts",];
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
        tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));

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
var onModifyCore = function(){
    gulp.src(["build/annieCore.js","build/add.js"]).pipe(concat("annieCore.js")).pipe(gulp.dest("build"));
    gulp.src(["build/annieCore.min.js","build/add.js"]).pipe(concat("annieCore.min.js")).pipe(gulp.dest("build"));
    gulp.src(["build/annieUI.js","build/add.js"]).pipe(concat("annieUI.js")).pipe(gulp.dest("build"));
    gulp.src(["build/annieUI.min.js","build/add.js"]).pipe(concat("annieUI.min.js")).pipe(gulp.dest("build"));
}
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
        tsResult.js.pipe(gulp.dest(outDir));
};
gulp.task('onBuildCore', onBuildCore);
gulp.task('onModifyCore',onModifyCore);
gulp.task('onBuildUI', onBuildUI);
gulp.task("onBuildDoc", onBuildDoc);
gulp.task('onBuildAll',['onBuildCore','onBuildUI']);