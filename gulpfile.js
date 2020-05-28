"use strict";

/*============================= Dependencies =============================*/

const gulp = require("gulp"),
    browserSync = require("browser-sync"),
    plumber = require("gulp-plumber"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename");

/* --- Dependencies: styles --- */
const sass = require("gulp-sass"),
    cleanCSS = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer");

/* --- Dependencies: scripts --- */

const uglify = require("gulp-uglify");

/* --- Dependencies: images --- */
const imagemin = require("gulp-imagemin");

/*------- Header Footer ----*/

var fileinclude = require("gulp-file-include");

var reload = browserSync.reload;
sass.compiler = require("node-sass");

/*================================= Configuration =================================*/

const NODE_ENV = process.env.NODE_ENV || "development";
const SASS_DIR = "src/styles";
const FONT_DIR = "src/assets/";
const SCRIPTS_DIR = "src/scripts";
const SCRIPTS_V_DIR = "src/scripts/vendors";
const ASSETS_DIR = "dist/assets";
const STYLE_DIR = "dist";
const SRC_DIR = "./src";

let config = {
    debug: NODE_ENV === "development" ? true : false,
    style: {
        src: SASS_DIR + "/main.scss",
        dest: STYLE_DIR + "/styles/"
    },
    scripts: {
        public: {
            src: [SCRIPTS_DIR + "/vendors/*.js", SCRIPTS_DIR + "/main.js"],
            dest: STYLE_DIR + "/scripts/",
            outputName: "app"
        },
        public: {
            src: [SCRIPTS_DIR + "/main.js"],
            dest: STYLE_DIR + "/scripts/",
            outputName: "app"
        }
    },
    general: {
        src: [SCRIPTS_DIR + "/general/*.js"],
        dest: "dist/js/"
    },
    fonts: {
        src: [FONT_DIR + "/fonts/*"],
        dest: ASSETS_DIR + "/fonts/"
    },
    images: {
        src: ["./src/assets/images/**/*.**"],
        dest: ASSETS_DIR + "/images/"
    }
};

/*================================= Tasks =================================*/

gulp.task("transform", () =>
    gulp
        .src("src/scripts/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ["@babel/preset-env"]
            })
        )
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/scripts/"))
);
gulp.task("sass", function() {
    return gulp
        .src(config.style.src, { sourcemaps: config.debug ? true : false })
        .pipe(plumber())
        .pipe(
            sass({
                includePaths: ["node_modules"],
                outputStyle: "expanded"
            })
        )
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"))
        .pipe(rename("app.css"))
        .pipe(gulp.dest(config.style.dest))
        .pipe(rename("app.min.css"))
        .pipe(cleanCSS())
        .pipe(
            gulp.dest(config.style.dest, {
                sourcemaps: config.debug ? "." : false
            })
        );
});

gulp.task("fonts", function() {
    return gulp.src(config.fonts.src).pipe(gulp.dest(config.fonts.dest));
});
gulp.task("general", function() {
    return gulp.src(config.general.src).pipe(gulp.dest(config.general.dest));
});

gulp.task("images", function() {
    return gulp.src(config.images.src).pipe(gulp.dest(config.images.dest));
});
gulp.task("fileinclude", function() {
    return gulp
        .src([SRC_DIR + "/*.html"])
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
                context: {
                    active_menu: "yes"
                }
            })
        )
        .pipe(gulp.dest("./dist/"));
});

gulp.task("imagemin", () =>
    gulp
        .src(config.images.src)
        .pipe(
            imagemin({
                progressive: true,
                optimizationLevel: 7,
                svgoPlugins: [{ removeViewBox: false }]
                /*use: [pngquant(), jpegtran(), optipng(), gifsicle()]*/
            })
        )
        .pipe(gulp.dest(config.images.dest))
);

// watch files for any changes.
let watchFiles = () => {
    // gulp.watch(SCRIPTS_DIR + "/**/*.js", gulp.series(["public-scripts"]));
    gulp.watch(SCRIPTS_DIR + "/**/*.js", gulp.series(["transform"]));
    gulp.watch(config.general.src, gulp.series(["general"]));
    gulp.watch(config.images.src, gulp.series(["images"]));
    gulp.watch(config.fonts.src, gulp.series(["fonts"]));
    gulp.watch(SASS_DIR + "/**/*.scss", gulp.series(["sass"]));
    gulp.watch(SRC_DIR + "/*.html", gulp.series(["fileinclude"]));
};

gulp.task("watch", gulp.series(gulp.parallel("transform", "sass"), watchFiles));

// build tasks.
gulp.task(
    "build",
    gulp.parallel(
        "transform",
        "general",
        "fonts",
        "sass",
        "fileinclude",
        gulp.series("images", "imagemin")
    )
);

// default tasks.
gulp.task(
    "default",
    gulp.parallel(
        "transform",
        "general",
        "fonts",
        "sass",
        "fileinclude",
        gulp.series("images", "imagemin"),
        watchFiles
    )
);
