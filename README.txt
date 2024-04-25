Initial installation
====================
Follows https://www.robinwieruch.de/minimal-react-webpack-babel-setup/
except for babel itself, where I followed instructions from the babel website.

Use this boilerplate:
- mkdir mathfrac
- https://github.com/kurisuchan444/mathfrac.git
- cd mathfrac
- npm install
- npm start

Key ingredients (not the latest versions...)
- Webpack 4 dev and prod
- React 16
- Babel (loader: 8, babel: 7)
- Hot loading for js, jsx, and css
- MobX
- mobx-router
- i18n
- Material-UI

Running (without node support):
- npm start [Development mode with hot loading]
- npm run build [build production]
- npm run web [Run minimal web server on dist]
- npm run php [Run php server]

