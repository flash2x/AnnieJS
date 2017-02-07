/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var jsList =[
    "annie/events/EventDispatcher.ts",
    "annie/events/Event.ts",
    "annie/events/MouseEvent.ts",
    "annie/geom/Point.ts",
    "annie/geom/Matrix.ts",
    "annie/geom/Rectangle.ts",
    "annie/display/DisplayObject.ts",
    "annie/display/bitmap.ts",
    "annie/display/Shape.ts",
    "annie/display/Sprite.ts",
    "annie/media/Media.ts",
    "annie/media/Sound.ts",
    "annie/media/Video.ts",
    "annie/media/ImageFrames.ts",
    "annie/display/MovieClip.ts",
    "annie/display/FloatDisplay.ts",
    "annie/display/VideoPlayer.ts",
    "annie/display/TextField.ts",
    "annie/display/InputText.ts",
    "annie/display/Stage.ts",
    "annie/filters/Filters.ts",
    "annie/render/IRender.ts",
    "annie/render/CanvasRender.ts",
    "annie/render/WGRender.ts",
    "annie/net/URLLoader.ts",
    "annie/utils/RESManager.ts",
    "annie/utils/Tween.ts",
    "annie/Annie.ts",
    "annie/GlobalFunction.ts",
    "annie/ui/scrollPage.ts"
];
var onBuild = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annie.js"
    };
    var outDir = "test/libs";
    var tsResult = gulp.src(jsList).pipe(ts(op));
    return merge([
        tsResult.dts.pipe(gulp.dest(outDir)),
        tsResult.js.pipe(gulp.dest(outDir))
    ]);
};
var onBuildDoc = function () {
    var op = {
        noImplicitAny: true,
        declaration: true
    };
    var outDir = "libs";
    var tsResult = gulp.src(jsList).pipe(ts(op));
    return merge([
        tsResult.js.pipe(gulp.dest(outDir))
    ]);
}
gulp.task('default', onBuild);
gulp.task("onBuildDoc", onBuildDoc);
//gulp.task('createHelp', gulpSequence["onBuildDoc", "onCreateDoc"]);
