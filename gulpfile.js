const gulp = require("gulp");
const rollup = require("rollup-stream");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("rollup-plugin-babel");
const minify = require("gulp-minify");
const plumber = require("gulp-plumber");

const createBundleTask = (directory, suffix) => {
  return () => {
    return rollup({
      input: `./src/${directory}/index.js`,
      format: "iife",
      sourcemap: true,
      plugins: [
        babel({
          exclude: "./node_modules/**"
        })
      ]
    })
      .on("error", function(error) {
        console.error(error.stack);
        this.emit("end");
      })
      .pipe(source(`outcome${suffix}.js`))
      .pipe(plumber())
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(
        minify({
          ext: {
            src: ".js",
            min: ".min.js"
          }
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("./dist"));
  };
};

gulp.task("bundle:manager", createBundleTask("manager", ""));
gulp.task("bundle:template", createBundleTask("template", "-template"));
gulp.task("bundle", ["bundle:manager", "bundle:template"]);

gulp.task("watch", () => {
  gulp.watch("./src/manager/**/*.js", ["bundle:manager"]);
  gulp.watch("./src/template/**/*.js", ["bundle:template"]);
});

gulp.task("default", ["bundle"]);
