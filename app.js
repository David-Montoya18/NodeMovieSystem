const conn = require('./dbconnection/dbconnect');
const http = require('http');
const fs = require('fs');
const port = 4000;

conn.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL DB');
});

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/index.html').pipe(res);
    } 
    else if (url === '/addCustomer'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/addCustomer.html').pipe(res);
    } 
    else if (url === '/listCustomer'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/listCustomer.html').pipe(res);
    } 
    else if (url === '/addMovie'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/addMovie.html').pipe(res);
    } 
    else if (url === '/listMovie'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/listMovie.html').pipe(res);
    }
    else if (url === '/addRent'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/addRent.html').pipe(res);
    }
    else if (url === '/listRent'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/listRent.html').pipe(res);
    }
    else if(url == '/listcustomers') {
        listcustomers(req, res);
    }
    else if(url == '/updatecustomer') {
        updatecustomer(req, res);
    }
    else if(url == '/deleteCustomer') {
        deleteCustomer(req, res);
    }
    else if(url == '/saveCustomer') {
        saveCustomer(req, res);
    }
    else if(url == '/listmovies') {
        listmovies(req, res);
    }
    else if(url == '/updateMovie') {
        updateMovie(req, res);
    }
    else if(url == '/deleteMovies') {
        deleteMovies(req, res);
    }
    else if(url == '/saveMovie') {
        saveMovie(req, res);
    }
    else if(url == '/searchMovie') {
        searchMovie(req, res);
    }
    else{
        let stream = fs.createReadStream(__dirname + '/public' + url);
        stream.on('err', ()=>{
            fs.createReadStream('resource not found').pipe(res)
        })
        stream.pipe(res)
    }
}).listen(port);

let listcustomers = (req, res) => {
    let cmd = 'SELECT * FROM users';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, {'content-type': 'json'});
        res.write(JSON.stringify(result));
        res.end();
    });    
}

let updatecustomer = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let users = new URLSearchParams(data);
        let form = Object.fromEntries(users);
        let id = form.usersID;
        delete form['usersID'];
        let cmd = 'UPDATE users SET ? WHERE usersID = ?';
        conn.query(cmd, [form, id], (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/listCustomer'})
            res.end(); 
        });
    });
}

let deleteCustomer = (req, res) => {
    let params = req.url.split('?')[1];
    let parsedParams = new URLSearchParams(params);
    let id = parsedParams.get('id');
    let cmd = 'DELETE FROM users WHERE usersID = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(302, {'location': '/listCustomer'});
        res.end();
    });
}

let saveCustomer = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let users = new URLSearchParams(data);
        let form = Object.fromEntries(users);
        let cmd = 'INSERT INTO users SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/addCustomer'});
            res.end(); 
        });
    });
}

let listmovies = (req, res) => {
    let cmd = 'SELECT * FROM movies';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, {'content-type': 'json'});
        res.write(JSON.stringify(result));
        res.end();
    });    
}

let updateMovie = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let movies = new URLSearchParams(data);
        let form = Object.fromEntries(movies);
        let id = form.movieID;
        delete form['movieID'];
        form.moviePremier = form.moviePremier == 'on' ? 1 : 0;
        form.movieStock = form.movieStock == 'on' ? 1 : 0;
        let cmd = 'UPDATE movies SET ? WHERE movieID = ?';
        conn.query(cmd, [form, id], (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/listMovie'});
            res.end(); 
        });
    });
}

let deleteMovies = (req, res) => {
    let params = req.url.split('?')[1];
    let parsedParams = new URLSearchParams(params);
    let id = parsedParams.get('id');
    let cmd = 'DELETE FROM movies WHERE movieID = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(302, {'location': '/listMovie'});
        res.end();
    });
}
let saveMovie = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let movies = new URLSearchParams(data);
        let form = Object.fromEntries(movies);
        form.moviePremier = form.moviePremier == 'on' ? 1 : 0;
        form.movieStock = form.movieStock == 'on' ? 1 : 0;
        // let form = JSON.parse(data);
        let cmd = 'INSERT INTO movies SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/addMovie'});
            res.end(); 
        });
    });
}
let searchMovie = (req, res) => {
    let params = req.url.split('?')[1];
    let data = new URLSearchParams(params);
    let form = Object.fromEntries(data);
    let title = form.movieTitle;

    let cmd = 'SELECT * FROM movie WHERE movieTitle = ?';
    conn.query(cmd, title, (err, result) => {
        if (err) throw err;
        res.writeHead(200, { 'content-type': 'json' });
        res.write(JSON.stringify(result));
        res.end();
    });

}