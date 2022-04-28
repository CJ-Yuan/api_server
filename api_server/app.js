// 导入 express 模块
const express = require('express');
// 导入 cors 中间件
const cors = require('cors');

// 创建 express 的服务器实例
const app = express();

//导入定义验证规则的包
const joi = require('joi')

//导入 解析 Token的包
const expressJWT = require('express-jwt')
const config = require('./config')

// 导入并注册用户路由模块
const userRouter = require('./router/user');


//导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userifo')

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')

// 导入并使用文章路由模块
const articleRouter = require('./router/article')

// 将 cors 注册为全局中间件
app.use(cors())

//配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件 注意：这个配置只能解析 application/x-www-form-urlencoded 格式
app.use(express.urlencoded({ extended:false }))

//一定要在路由之前，封装 res.cc 函数
app.use((req,res,next)=>{
    //status 默认值为 1，表示失败的情况
    //err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function(err,status=1){
        res.send({
            status,
            message: err instanceof Error ? err.message:err
        })
    }
    next()
})


//一定要在路由之前配置解析 Token 的中间件
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

// 为路由挂载统一的访问前缀
app.use('/api', userRouter);
app.use('/my',userinfoRouter);
app.use('/my/ariticle',artCateRouter)
app.use('/my/article',articleRouter)
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))


//定义错误级别的中间件
app.use((err,req,res,next)=>{
    //验S证失败导致的错误
    if(err instanceof joi.ValidationError) return res.cc(err)
    //这是是否验证失败后的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份验证失败')
    //未知的错误
    res.cc(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
  })