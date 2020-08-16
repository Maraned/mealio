class ScriptCache {
  constructor() {
    this.loaded = [];
    this.failed = [];
    this.pending = [];
  }

  loadSrc(src) {
    if (this.loaded.indexOf(src) >= 0) {
      return Promise.resolve(src);
    }

    this.pending.push(src);
    return this.scriptTag(src)
      .then(() => {
        // handle success
      })
      .catch(() => {
        // handle cleanup
      })
  }

  scriptTag(src) {
    return new Promise((resolve, reject) => {
      // let resolved = false;
      // let errored = false;
      let body = document.getElementsByTagName('body')[0];
      let tag = document.createElement('script');

      tag.type = 'text/javascript';
      tag.async = false; // Load in order

      // const handleCallback = tag.onreadystatechange = () =>  {
      //   if (resolved) return handleLoad();
      //   if (errored) return handleReject();
      //   const state = tag.readyState;
      //   if (state === 'complete') {
      //     handleLoad()
      //   } else if (state === 'error') {
      //     handleReject()
      //   }
      // }

      const handleLoad = () => {
        // resolved = true;
        resolve(src);
      }
      const handleReject = () => {
        // errored = true; 
        reject(src) 
      }

      tag.addEventListener('load', handleLoad)
      tag.addEventListener('error', handleReject);
      tag.src = src;
      body.appendChild(tag);
      return tag;
    });
  }
}

const scriptCache = new ScriptCache();

export default scriptCache;
