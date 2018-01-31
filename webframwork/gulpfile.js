const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const rollup = require('gulp-rollup');
// process.env.NODE_ENV 判断
const replace = require('rollup-plugin-replace');

// 开发环境
gulp.task('builddev', () => {
  // watch所有JS文件的变动
  return watch('./src/nodeuii/**/*.js', {
    ignoreInitial: false
  }, () => {
    gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({ // 执行babel
        babelrc: false, // 不使用.babelrc文件中的配置
        'plugins': [
          'transform-decorators-legacy',
          'transform-es2015-modules-commonjs'
        ]
      }))
      .pipe(gulp.dest('./builddev/')) // 编译输出
  })
});

// 上线环境
// gulp.task('buildprod', () => {
//   gulp.src('./src/nodeuii/**/*.js')
//     .pipe(babel({ // 执行babel
//       babelrc: false, // 不使用.babelrc文件中的配置
//       'ignore': ['./src/nodeuii/app.js'],
//       'plugins': [
//         'transform-es2015-modules-commonjs'
//       ]
//     }))
//     .pipe(rollup({	// 使用rollup，将dev用的代码清除 => 流清洗
//     	input: ['./src/nodeuii/app.js'],
//     	format: 'cjs',
//     	"plugins": [
//     		replace({
//     			'process.env.NODE_ENV': JSON.stringify('production')
//     		})
//     	]
//     }))
//     .pipe(gulp.dest('./buildprod/')) // 编译输出
// });

// babel编译
gulp.task('buildbabel', () => {
  gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({
        babelrc: false,
        'ignore': ['./src/nodeuii/app.js'],
        'plugins': [
          'transform-decorators-legacy',
          'transform-es2015-modules-commonjs'
        ]
      }))
      .pipe(gulp.dest('./buildprod/'))
});

// 流清洗
gulp.task('buildreplace', () => {
  gulp.src('./src/nodeuii/**/*.js')
      .pipe(rollup({    // 使用rollup，将dev用的代码清除 => 流清洗
        input: ['./src/nodeuii/app.js'],
        format: 'cjs',
        'plugins': [
          replace({
            'process.env.NODE_ENV': JSON.stringify('production')
          })
        ]
      }))
      .pipe(gulp.dest('./buildprod/'))
});

// 判断是否是上线环境
// const _flag = (process.env.NODE_ENV == 'production');

let build = ['builddev'];
if (process.env.NODE_ENV == 'production') {
  build = ['buildbabel', 'buildreplace']
}

// 根据NODE_ENV的值来判断运行哪个task
gulp.task('default', build)