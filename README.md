# Reactron
## Desenvolviemnto de aplicativo desktop (Windows, Linux e Mac) com o React e o Electron

Esta é uma atualização, <a href="https://medium.com/totvsdevelopers/reactron-criando-um-aplicativo-com-o-react-e-o-electron-21062798dfee">click aqui para ver o post original</a>

Para desenvolver aplicações desktop utilizando dos conceitos do React, basta realizar as seguintes ações:

### Inicie um projeto React.js:

``npx create-react-app app``

### Exclua os arquivos desnecessarios:

```
-- /public
-- /src/App.css
-- /src/App.test.js
-- /src/index.css
-- /src/logo.svg
-- /src/reportWebVitals.js
-- /src/setupTests.js
```

### Instale as dependencias:

``npm i electron electron-builder electron-react-devtools gulp gulp-babel gulp-clean-css gulp-concat gulp-livereload @babel/core @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-react babel-jest react-test-renderer -D``

``npm i electron-is-dev react-router-dom --save``

### Altere o "package.json":

Substitua os scripts por:

```
"scripts": {
    "build": "gulp build",
    "start": "gulp",
    "dist": "gulp dist"
},
```

E acrescente a linha:

```
"main": "app/main.js"
```

### Crie o arquivo "gulpfile.js" na raiz do projeto com o seguinte codigo:

```
const exec = require('child_process').exec;

const gulp = require('gulp');
const babel = require('gulp-babel');
const css = require('gulp-clean-css');
const livereload = require('gulp-livereload');

gulp.task('copy', () => {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('app/assets'));
});

gulp.task('html', () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('app/'))
        .pipe(livereload());
});

gulp.task('css', () => {
    return gulp.src('src/**/*.css')
        .pipe(css())
        .pipe(gulp.dest('app/'))
        .pipe(livereload());
});

gulp.task('js', () => {
    return gulp.src(['main.js', 'src/**/*.js'])
        .pipe(babel({
            "presets": ["@babel/env", "@babel/react"],
            "plugins": ["@babel/plugin-proposal-class-properties"]
          }))
        .pipe(gulp.dest('app/'))
        .pipe(livereload());
});

gulp.task('watch', async function () {
    livereload.listen();
    gulp.watch('src/**/*.html', gulp.series('html'));
    gulp.watch('src/**/*.css', gulp.series('css'));
    gulp.watch('src/**/*.js', gulp.series('js'));
});

gulp.task('build', gulp.series('copy', 'html', 'css', 'js'));

gulp.task('start', gulp.series('build', () => {
    return exec(
        __dirname + '/node_modules/.bin/electron .'
    ).on('close', () => process.exit());
}));

gulp.task('default', gulp.parallel('start', 'watch'));

gulp.task('dist', gulp.series('build', () => {
    return exec(
        __dirname + '/node_modules/.bin/electron-builder .'
    ).on('close', () => process.exit());
}));
```

### Crie o arquivo "main.js" na raiz do projeto com o seguinte codigo:

```
const { app, BrowserWindow } = require('electron')
var path = require('path');
let mainWindow;

exports.execProcess = (process, callback) => {
  const { exec } = require('child_process');
  const callExec = exec(process)

  callExec.stdout.on('data', function (data) {
    callback(data)
  })
  callExec.stderr.on('data', function (data) {
    callback("<b>ERROR:</b> \n" + data)
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    // Caracteristicas visuais da janela
    // autoHideMenuBar: true,
    // titleBarStyle: 'customButtonsOnHover',
    frame: true, // Retira barra superior
    useContentSize: false, // Inibe mostragem de dimensao da janela

    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(String(Object.assign(new URL(path.join(__dirname, 'index.html')), {
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### Crie o arquivo "index.html" na pasta src do projeto com o seguinte codigo:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <div id="app">
    </div>
    <script src="./index.js"></script>
  </body>
</html>
```

### Altere o index.js na pasta src do projeto para o seguinte codigo:

```
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.js';

window.onload = () => {
    ReactDOM.render(
        <Router>
            <App />
        </Router>,
        document.getElementById('app'));
};
```

Tudo certo, inicie o projeto com ``npm start`` e quando finalizar basta executar ``npm run dist`` para ter o executavel da sua aplicação.
