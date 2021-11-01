const http = require('http');
const path = require('path');
const fs = require(`fs`);

const server = http.createServer((req, res) => {
	//build file path
	let filePath = path.join(
		__dirname,
		'public',
		req.url === '/' ? 'index.html' : `${req.url}.html`
	);

	//file extension
	let extension = path.extname(filePath);

	//initial content type
	let contentType = 'text/html';

	//check cases
	switch (extension) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		default:
			contentType = 'text/html';
			break;
	}
	//read files
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code === 'ENOENT') {
				//page not found
				fs.readFile(path.join(__dirname, 'public', 'notFound.html'), (err, content) => {
					res.writeHead(200, {
						contentType: 'text/html',
					});
					res.end(content, 'utf8');
				});
			} else {
				//some server error
				res.writeHead(500);
				res.end(`Server Error: ${err.code}`);
			}
		} else {
			res.writeHead(200, {
				contentType: contentType,
			});
			res.end(content, 'utf8');
		}
	});
});

const port = process.env.port || 8080;

server.listen(port, () => console.log(`server running on port ${port}`));
