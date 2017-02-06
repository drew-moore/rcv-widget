import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'suffixed'
})
export class SuffixedPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return `${value}st`;
      case 2:
        return `${value}nd`;
      case 3:
        return `${value}rd`;

      default:
        return `${value}th`;

    }
  }

}
