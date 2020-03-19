class LazyImageLoad {
                
  /**
   * LazyImageLoad takes optional object containing 3 parameters:
   * options.images - This is Nodelist containg DOM elements to be lazyload. Default: gets all "img[dataset]" elements from the DOM (array)
   * options.offset - This is additional buffer scroll combined with user's current scroll which will trigger LazyImageLoad to load the images earlier while they are not on the screen. Default: 0.5 * window.innerHeight (number)
   * options.loadDelay - The time it takes to load the images after user stopped scrolling. Default: 100 (number)
   * options.loadedClass - The class added to the loaded images. Default: "lazy--loaded" (string)
   * options.showStats - Toggle stats after scripts load all the images: Default: true (bool)
   * options.attribute - Data Attribute in the img element containing the resource to be lazyload: Default: "dataset" (string)
   */

  constructor(options) {
      
      self = this;
      
      /**
       * Counts loaded images
       * @type {Number}
       */
      self.loadedCounter = 0;

      /**
       * Data attribute in the img element containg the image url to be loaded
       * @type {String}
       */
      self.attribute = (options && options.attribute) || "dataset"

      /**
       * Show stats of this instance after the script has finished loading the images from the self.imageSelector
       * @type {Boolean}
       */
      self.showStats = (options && options.showStats) || true;

      /**
       * Class name to be added to the loaded images
       * @type {String}
       */
      self.loadedClass = (options && options.loadedClass) || "lazy--loaded";

      /**
       * Nodelist with images
       * @type {Array of objects}
       */
      self.imageSelector = (options && options.images) || document.querySelectorAll('img[' + self.attribute + ']');
      
      /**
       * Counts images to be lazyload
       * @type {Number}
       */
      self.imageCounter = self.imageSelector.length;
      
      /**
       * Additional buffer scroll value to trigger earlier image loading
       * @type {Number}
       */
      self.offset = options && options.offset || window.innerHeight * 0.5;

      /**
       * Loads the image with Xms delay after the user stopped scrolling
       * @type {Number}
       */
      self.loadDelay = options && options.loadDelay || 100;

      /**
       * Timeout containg the self.loadDelay value and the lazyload script
       * @type {Mixed}
       */
      self.timeout = null;

      /**
       * Init the script at first loading. This will load all images visible on the current screen.
       */
      self.lazyImageLoader();

      /**
       * Load the script
       */
      self.bindLoader();
  }

  /**
   * Loops the Image Nodelist array and sets the dataset attribute as the image source. Incriment the self.loadedCounter, removes the already loaded image from the array.
   * @return {}
   */
  lazyImageLoader(){

      for(let i = 0; i < self.imageSelector.length; i++){
          if(self.imageSelector[i] !== undefined && self.imageSelector[i].hasAttribute( self.attribute )){
            if(self.imageSelector[i].offsetTop < (window.innerHeight + window.pageYOffset + self.offset) ){
                self.imageSelector[i].src = self.imageSelector[i].getAttribute( self.attribute );
                self.imageSelector[i].classList.add( self.loadedClass );
                self.imageSelector[i].removeAttribute(self.attribute);
                self.loadedCounter++;
            }
          }
      }
  }
  
  /**
   * Checking if all images have been loaded
   * @return {Boolean}
   */
  doneLoading(){
      return self.imageCounter === self.loadedCounter;
  }

  /**
   * Unbinds the scorll listener of the script from the window 
   * @return {Object} Returns stats with details of loaded elements
   */
  unbindLoader(){
      window.removeEventListener('scroll', self._init);
      if( self.showStats === true ){
        self._stats();
      }
  }

  /**
   * Binds the scroll listener to the window, starts the lazyloading
   * @return {}
   */
  bindLoader(){
      if(self.imageCounter > 0){
          window.addEventListener('scroll', self._init, false);
      }
  }

  /**
   * Check if image has to be lazyloaded, creates a timeout, runs the lazyload logic with a self.loadDelay delay
   * @return {}
   */
  _init(){
      if(self.doneLoading() === true){
          clearTimeout(self.timeout);    
          self.unbindLoader();
      }else{
          if(self.timeout !== null) {
              clearTimeout(self.timeout);        
          }
          self.timeout = setTimeout( function(){
              self.lazyImageLoader();
          }, self.loadDelay);
      }
  }

  /**
   * Logs object with stats for this instance
   * @return {Object}
   */
  _stats(){
      console.log({
          totalImages: self.imageCounter, 
          totalImagesLoaded: self.loadedCounter, 
          offset: self.offset, 
          loadDelay: self.loadDelay, 
          timeout_id: self.timeout, 
      });
  }
}