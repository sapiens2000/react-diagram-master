const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		createProxyMiddleware('/api/diagram', {
			target: 'http://localhost:8080', 
			changeOrigin: true,
		})
	);
};