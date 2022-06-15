# Lazy Image Load #

### Usage ###

LazyImageLoad accept and object as an optional parameter where you can configure the script. The parameters used in the following object `options` are the *default* values of the script

```
var options = {

  images: document.querySelectorAll("img[dataset]"),
  offset: 300,
  loadDelay: 100,
  loadedClass: "lazy--loaded",
  showStats: true,
  attribute: "dataset",

};

new LazyImageLoad( options );
```

### Options ###

`options.images` - `(array)` - This is Nodelist containg DOM elements to be lazyload. Default: `document.querySelectorAll("img[dataset]")`

`options.offset` - `(number)` - This is additional buffer scroll combined with user's current scroll which will trigger LazyImageLoad to load the images earlier while they are not on the screen. Default: `0.5 window.innerHeight`

`options.loadDelay` - `(number)` - The time it takes to load the images after user stopped scrolling. Default: `100`

`options.loadedClass` - `(string)` - The class added to the loaded images. Default: `"lazy--loaded"`

`options.showStats` - `(boolean)` - Toggle stats after scripts load all the images: Default: `false`

`options.attribute` - `(string)` - Data Attribute in the img element containing the resource to be lazyload: Default: `"dataset"`