import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule, MdIconRegistry} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import "hammerjs";
import {HoverableDirective} from "./directives/hoverable.directive";
import {SuffixedPipe} from "./pipes/suffixed.pipe";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot()
  ],
  declarations: [ HoverableDirective, SuffixedPipe ],
  exports: [ CommonModule, MaterialModule, FlexLayoutModule, HoverableDirective, SuffixedPipe ]
})
export class SharedModule {

  constructor(iconRegistry: MdIconRegistry) {
    iconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

}
