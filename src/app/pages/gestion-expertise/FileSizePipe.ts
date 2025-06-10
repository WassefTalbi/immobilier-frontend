import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals: number = 1): string {
    if (bytes === 0) return '0 o';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
