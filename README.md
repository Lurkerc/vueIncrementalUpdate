# vueIncrementalUpdate

> A Vue.js vue incremental update project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

默认已开启gz压缩，在服务端nginx配置如下：
```
http {
  gzip on; #开启或关闭gzip on|off　　 
  gzip_static on;#是否开启gzip静态资源
  gzip_disable "msie6"; #不使用gzip IE6
  gzip_min_length 100k; #gzip压缩最小文件大小，超出进行压缩（自行调节）
  gzip_buffers 4 16k; #buffer 不用修改
  gzip_comp_level 3; #压缩级别:1-10，数字越大压缩的越好，时间也越长
  gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; #  压缩文件类型
  gzip_vary off; #跟Squid等缓存服务有关，on的话会在Header里增加 "Vary: Accept-Encoding"
}
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
