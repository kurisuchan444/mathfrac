Initial installation
====================
Follows https://www.robinwieruch.de/minimal-react-webpack-babel-setup/
except for babel itself, where I followed instructions from the babel website.

Use this boilerplate:
- cd boilerplate
- npm install
- npm start

Key ingredients:
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

TODO
=============================
[X] Initial picture (L')
[X] Restore L'
[X] Show axes (switch) in gray - right
[X] Show every transform in a different color (as a switch)
[ ] "Custom" setup
[ ] If you edit a set, it becomes Custom (based on Tree)
[ ] Add a row in table, copy a row, remove a row
[ ] Show axes (switch) in gray - left
[ ] Respect colors, allow colors
[ ] Save to PNG
[ ] Print
