"use strict";

var gulp = require("gulp"),
less = require("gulp-less"),
plumber = require("gulp-plumber"),
postcss = require("gulp-postcss"),
uncss = require('gulp-uncss'),
autoprefixer = require("autoprefixer"),
mqpacker = require("css-mqpacker"),
minify = require("gulp-csso"),
rename = require("gulp-rename"),
imagemin = require("gulp-imagemin"),
svgmin = require("gulp-svgmin"),
svgstore = require("gulp-svgstore"),
server = require("browser-sync"),
run = require("run-sequence"),
del = require("del");

gulp.task("style", function() {
	gulp.src("assets/less/style.less")
	.pipe(plumber())
	.pipe(less())
	.pipe(uncss({
		html: ['index.html', 'posts/**/*.html', 'http://example.com']
	}))
	.pipe(postcss([
		autoprefixer({browsers: [
			"last 1 version",
			"last 2 Chrome versions",
			"last 2 Firefox versions",
			"last 2 Opera versions",
			"last 2 Edge versions"
			]}),
		mqpacker({
			sort: true
		})
		]))
	.pipe(gulp.dest("assets/css"))
	.pipe(minify())
	.pipe(rename("style.min.css"))
	.pipe(gulp.dest("assets/css"))
	.pipe(server.reload({stream: true}));
});

gulp.task("images", function() {
	gulp.src("assets/img/**/*.{png,jpg,gif}")
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegran({progressive: true})
		]))
	.pipe(gulp.dest("assets/img"))
});

gulp.task("symbols", function() {
	gulp.src("assets/img/icons/*.svg")
	.pipe(svgmin())
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("symbols.svg"))
	.pipe(gulp.dest("assets/img"))
});

gulp.task("serve", ["style"], function() {
	server.init({
		server: ".",
		notify: false,
		open: true,
		ui: false
	});

	gulp.watch("assets/less/**/*.less", ["style"]);
	gulp.watch("*.html").on("change", server.reload);
});

gulp.task("build", function(fn) {
	run("style", "images", "symbols", fn)
});

gulp.task("copy", function() {
	gulp.src([
		"assets/fonts/**/*.{woff,woff2}",
		"assets/img/**",
		"assets/js/**",
		"*.html"
		], {
			base: "."
		})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
	del("build");
});