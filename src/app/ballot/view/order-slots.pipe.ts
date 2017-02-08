import {Pipe, PipeTransform} from "@angular/core";
import {BallotOption} from "../ballot.state";

@Pipe({
  name: 'orderSlots'
})
export class OrderSlotsPipe implements PipeTransform {

  transform(value: (BallotOption|null)[], args?: any): (BallotOption|null)[] {
    return value.sort((x, y) => {
      if (!(x == null || y == null)) {
        return x.selectedIndex - y.selectedIndex;
      } else if (x == null && y == null) {
        return 0;
      } else if (x == null) {
        return 1;
      } else {
        //y and only y is null
        return -1;
      }
    })
  }

}
