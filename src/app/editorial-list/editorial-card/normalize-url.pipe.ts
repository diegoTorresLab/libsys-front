import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeUrl'
})
export class NormalizeUrlPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if(!value){
      return '';
    }

    let url = value.trim();

    if(url.startsWith('https://') || url.startsWith('http://')){
      return url;
    }

    if(!url.startsWith('https://') || !url.startsWith('http://')){
      return `https://${url}`
    }

    return `https://${url}`
  }
}
