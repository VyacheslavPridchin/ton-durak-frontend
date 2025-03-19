export class ImageCache {
  private static cache: Map<string, HTMLImageElement> = new Map();
  private static loading: Map<string, Promise<HTMLImageElement>> = new Map();
  private static readonly CACHE_NAME = "durak-cache";

  /** 🔹 Предзагрузка одного изображения */
  static async preloadImage(url: string): Promise<void> {
    await this.loadImage(url);
  }

  /** 🔹 Предзагрузка массива изображений */
  static async preloadImages(urls: string[]): Promise<void> {
    await Promise.all(urls.map((url) => this.loadImage(url)));
  }

  /** 🔹 Инициализация кэша */
  static async initCache(): Promise<void> {
    const cache = await caches.open(this.CACHE_NAME);
    const requests = await cache.keys();
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        this.createImage(URL.createObjectURL(blob), request.url);
      }
    }
  }

  /** 🔹 Получает загруженное изображение или ждет его загрузки */
  static async getImage(url: string): Promise<HTMLImageElement | null> {
    const resolvedUrl = this.resolveUrl(url);

    if (this.cache.has(resolvedUrl)) {
      return this.cache.get(resolvedUrl)!;
    }

    if (this.loading.has(resolvedUrl)) {
      return this.loading.get(resolvedUrl)!;
    }

    return this.loadImage(resolvedUrl);
  }

  /** 🛠 Загружает изображение и кэширует его */
  private static async loadImage(url: string): Promise<HTMLImageElement> {
    const resolvedUrl = this.resolveUrl(url);

    if (this.cache.has(resolvedUrl)) {
      return Promise.resolve(this.cache.get(resolvedUrl)!);
    }

    if (this.loading.has(resolvedUrl)) {
      return this.loading.get(resolvedUrl)!;
    }

    const imagePromise = new Promise<HTMLImageElement>(async (resolve, reject) => {
      try {
        let blob: Blob;
        const cache = await caches.open(this.CACHE_NAME);
        const cachedResponse = await cache.match(resolvedUrl);

        if (cachedResponse) {
          blob = await cachedResponse.blob();
        } else {
          const response = await fetch(resolvedUrl, { mode: "cors" });
          if (!response.ok) throw new Error(`Failed to fetch ${resolvedUrl}`);

          const responseClone = response.clone(); // ✅ Клонируем перед чтением
          blob = await response.blob();
          cache.put(resolvedUrl, responseClone); // ✅ Используем клон
        }

        const objectURL = URL.createObjectURL(blob);
        this.createImage(objectURL, resolvedUrl).onload = () => {
          resolve(this.cache.get(resolvedUrl)!);
          this.loading.delete(resolvedUrl);
        };
      } catch (error) {
        this.loading.delete(resolvedUrl);
        reject(error);
      }
    });

    this.loading.set(resolvedUrl, imagePromise);
    return imagePromise;
  }

  /** 🛠 Преобразует относительный путь в абсолютный */
  private static resolveUrl(url: string): string {
    if (url.startsWith("http") || url.startsWith("blob:")) {
      return url;
    }
    return new URL(url, window.location.origin).href;
  }

  /** 🛠 Создает HTMLImageElement и добавляет в кэш */
  private static createImage(blobUrl: string, originalUrl: string): HTMLImageElement {
    const img = new Image();
    img.src = blobUrl;
    this.cache.set(originalUrl, img);
    return img;
  }
}
