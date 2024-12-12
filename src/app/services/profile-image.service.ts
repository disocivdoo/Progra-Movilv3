import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  // Imagen predeterminada estilo avatar genérico
  private readonly defaultProfileImage = 'assets/img/default-avatar.svg';

  constructor() { }

  getProfileImage(imageUrl: string | undefined | null): string {
    if (!imageUrl || imageUrl.trim() === '') return this.defaultProfileImage;
    
    try {
      // Verificar si es una URL válida
      new URL(imageUrl);
      // Verificar si es una imagen
      if (this.isValidImageExtension(imageUrl)) {
        return imageUrl;
      }
      return this.defaultProfileImage;
    } catch {
      // Si no es una URL válida, verificar si es una ruta local
      if (imageUrl.startsWith('assets/') && this.isValidImageExtension(imageUrl)) {
        return imageUrl;
      }
      return this.defaultProfileImage;
    }
  }

  private isValidImageExtension(url: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    return validExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }
}