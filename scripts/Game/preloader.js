class Preloader {
    images = [];
    imagesLoaded = 0;
    imagesToLoad;
    load(textures) {
        this.imagesToLoad = textures.length;
        textures.forEach(srcObject => {
            if(typeof(srcObject) === 'string') {
                srcObject = srcObject.replaceAll("../", "");
                let image = new Image();
                image.src = srcObject;
                image.onload = () => {
                    this.newImageLoaded();
                }
                this.images[srcObject] = image;
            }
            else if(typeof(srcObject) === 'object') {
                if(!srcObject.count || !srcObject.src) {
                    throw new Error("missing src or count in image object")
                }
                const src = srcObject.src.replaceAll("../", "");
                if(!src.endsWith("/")) {
                    throw new Error("unable to handle src '" + src + "' as multiple images")
                }
                this.imagesToLoad += srcObject.count - 1;
                for (let i = 0; i < srcObject.count; i++) {
                    const imgSrc = src + (i + 1) + ".png";
                    const image = new Image();
                    image.src = imgSrc;
                    image.onload = () => {
                        this.newImageLoaded();
                    };
                    this.images[imgSrc] = image;
                }
            }
            else {
                throw new Error("unknown type for src")
            }
        });
    }

    newImageLoaded() {
        this.imagesLoaded++;
        if(this.imagesLoaded === this.imagesToLoad) {
            this.onload();
        }
    }

    /**
     *
     * @param {string} src
     */
    get(src) {
        if (typeof src != "string") {
            throw new Error("src should be a string")
        }
        src = src.replaceAll("../", "");
        if (this.images[src]) {
            return this.images[src];
        }
        throw new Error("image " + src + " has not been loaded")
    }

    onload(){}
}

export default Preloader;
