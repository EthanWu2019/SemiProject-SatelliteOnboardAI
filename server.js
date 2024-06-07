const express = require('express');
const path = require('path');
const app = express();

// 提供静态文件访问
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
