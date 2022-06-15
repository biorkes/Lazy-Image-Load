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
      
      /**
       * Take options as a class object
       * @type {Object}
       */
      this.options = options;
          
      /**
       * Counts loaded images
       * @type {Number}
       */
      this.loadedCounter = 0;

      /**
       * Data attribute in the img element containg the image url to be loaded
       * @type {String}
       */
      this.attribute = (options && options.attribute) || "dataset"

      /**
       * Show stats of this instance after the script has finished loading the images from the this.imageSelector
       * @type {Boolean}
       */
      this.showStats = (options && options.showStats) || false;

      /**
       * Class name to be added to the loaded images
       * @type {String}
       */
      this.loadedClass = (options && options.loadedClass) || "lazy--loaded";

      /**
       * Nodelist with images
       * @type {Array of objects}
       */
      this.imageSelector = (options && options.images) || document.querySelectorAll('img[' + this.attribute + ']');
      
      /**
       * Counts images to be lazyload
       * @type {Number}
       */
      this.imageCounter = this.imageSelector.length;
      
      /**
       * Additional buffer scroll value to trigger earlier image loading
       * @type {Number}
       */
      this.offset = options && options.offset || window.innerHeight * 0.5;

      /**
       * Loads the image with Xms delay after the user stopped scrolling
       * @type {Number}
       */
      this.loadDelay = options && options.loadDelay || 100;

      /**
       * Timeout containg the self.loadDelay value and the lazyload script
       * @type {Mixed}
       */
      this.timeout = null;

      /**
       * Init the script at first loading. This will load all images visible on the current screen.
       */
      this.lazyImageLoader();

      /**
       * Load the script
       */
      this.bindLoader();
  }

  /**
   * Loops the Image Nodelist array and sets the dataset attribute as the image source. Incriment the self.loadedCounter, removes the already loaded image from the array.
   * @return {}
   */
  lazyImageLoader(){

      for(let i = 0; i < this.imageSelector.length; i++){
          if(this.imageSelector[i] !== undefined && this.imageSelector[i].hasAttribute( this.attribute )){
            if(this.imageSelector[i].offsetTop < (window.innerHeight + window.pageYOffset + this.offset) ){
                this.imageSelector[i].src = this.imageSelector[i].getAttribute( this.attribute );
                this.imageSelector[i].classList.add( this.loadedClass );
                this.imageSelector[i].removeAttribute(this.attribute);
                this.loadedCounter++;
            }
          }
      }
  }
  
  /**
   * Checking if all images have been loaded
   * @return {Boolean}
   */
  doneLoading(){
      return this.imageCounter === this.loadedCounter;
  }

  /**
   * Unbinds the scorll listener of the script from the window 
   * @return {Object} Returns stats with details of loaded elements
   */
  unbindLoader(){
      window.removeEventListener('scroll', this._init.bind(this));
      if( this.showStats === true ){
        this._stats();
      }
  }

  /**
   * Binds the scroll listener to the window, starts the lazyloading
   * @return {}
   */
  bindLoader(){
      if(this.imageCounter > 0){
          window.addEventListener('scroll', this._init.bind(this), false);
      }
  }

  /**
   * Check if image has to be lazyloaded, creates a timeout, runs the lazyload logic with a this.loadDelay delay
   * @return {}
   */
  _init(){
      if(this.doneLoading() === true){
          clearTimeout(this.timeout);    
          this.unbindLoader();
      }else{
          if(this.timeout !== null) {
              clearTimeout(this.timeout);        
          }
          this.timeout = setTimeout( this.lazyImageLoader(), this.loadDelay);
      }
  }

  /**
   * Logs object with stats for this instance
   * @return {Object}
   */
  _stats(){
      console.log({
          totalImages: this.imageCounter, 
          totalImagesLoaded: this.loadedCounter, 
          offset: this.offset, 
          loadDelay: this.loadDelay, 
          timeout_id: this.timeout, 
      });
  }
}