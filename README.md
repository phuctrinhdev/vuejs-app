### Project setup
```
download & install node v10.16.3 (~ npm v6.9.0)
npm install
```

##### Compiles and run eslint
```
npm run lint
```

##### Compiles and run eslint & auto fix
```
npm run lintfix
```

##### Compiles and hot-reloads for development
```
npm run dev
```

##### Compiles and minifies for production
```
npm run prod
```


### Project's structure
```
1. Webpack 4: module bundling
2. Eslint: javascript style guide & coding conventions
3. Babel-loader: backwards compatible version of JavaScript in older browsers or environments
4. Vuejs: single file component & lazy loading
5. Bootstrap-vue: popular components base Vuejs
6. Code organization
src/
  api       : connect with apis
  components: vue component
  config    : app config
  pages     : vue pages loaded by router
  store     : store states base vuex
  template  : css, scss, images, fonts for static layout
  translate : multi language base vue-i18n
  view-model: model data for front-end
test/
  components: testing component
  helpers   : helpers for testing
  view-model: testing view-model
```

##### Dev process
```
1. run dev
2. run lint & lintfix (when need)
3. run prod
4. run test in chrome, ie11
```

##### Code conventions
```
1. production always need high quality code so developer must be deep understand for customize & optimize
2. gitlab
 - take issue to do
 - comment in code & commit code with ID issue (ex: #31: update product page)
 - update info by comment on gitlab to team follow
3. try to use meaningful variables & follow naming rules
  - constant global name: `SALES_AND_INTERNAL_USE`
  - variable name: `product_category` (because Linux OS don't unserstand file name & variable name with capitalization (!= lowercase) => make errors)
  - fuction name: 
    + event call: `onClickEditProduct()`
    + load data : `loadProductCategory()`
    + async function: must has Async is suffix (ex: `updateProductCategoryAsync`)
  - class name: ProductCategoryViewModel
4. try to optimize code by refactoring
  - check code conventions & best practices
  - create base classes, static classes, utility function,...
  - readable, reuseable, maintainable, optimize loading
```

##### Css' best practices
```
1. extract neccessary css, delete css not relevant
2. convert css -> scss (online-tool: http://css2sass.herokuapp.com/, http://beautifytools.com/css-to-scss-converter.php)
3. image should use css sprites, icon should use library can change size
4. use class with clear & meaningfull name, don't use ID
5. use combined class for general element/component. ex: .btn.btn-link is better than just .btn-link
6. use variables: color, font, size,... don't use fix value in css
7. breakdown css file into sections by comment when too long
8. split css to module in template for reuse
9. css priorities: framework -> framework custom -> component -> page
10. css order: from outside to inside. ex:
  - display, position, float
  - width, height
  - margin, padding
  - border, background, font
  - transition, animation & other
```

##### Responsive bootstrap recommended
```
// Bootstrap grid system | Device in pixel                  | Media query
// extra large: .col-xl- | 1200++       -> desktop          | ...
// large      : .col-lg- | 992 - 1199px -> ipad landscape   | @media (max-width: 1199.98px)
// medium     : .col-md- | 768 - 991px  -> ipad             | @media (max-width: 991.98px)
// small      : .col-sm- | 576 - 767px  -> mobile landscape | @media (max-width: 767.98px)
// extra small: .col-    | 360 - 575px  -> mobile           | @media (max-width: 575.98px)
```

##### Convert layout to vuejs
```
0. analyze requirements
 + clear work-flow
 + reusable component & function
 + estimate time
1. create full UI static layout
 + add route for page
 + add static & responsive layout: use bootstrap-vue & other libs
2. convert to vue page & component: 
 + create view-model & fake data (from api that known data structure)
 + create store (vuex module)
 + create page & component
 + translate, validate form
 + make UI consistent & smooth 
3. connect with api 
 + write {model}-api: getList, getItem, add, edit, delete
 + search, filter, sort
4. testing: 
 + UI: Chrome, Firefox, Edge, IE11 
 + Case: view-model
5. review & fixbug
 + check duplicate code
```

##### Create component process
```
1. create store/module for UI: data, state, getter
2. create new-component.vue
3. add to Parent Pages / Component
  - import new-component.vue into, then registry & add tag
  - getdata from Getter in store
  - process data for viewing
4. translate static title / label
5. make mutation, action base need
```