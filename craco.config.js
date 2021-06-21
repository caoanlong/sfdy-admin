module.exports = {
    devServer: {
        port: 4000,
        proxy: {
            '/boss': {
                target: 'http://localhost:8300',
                // target: 'https://admin.jyav.me',
                changeOrigin: true,
                // pathRewrite: {
                //     "^/loc": ''
                // }
            }
        },
    },
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer')
            ]
        },
    }
}