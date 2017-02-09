import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {AdminContainerComponent} from "./admin-container.component";
import {AdminViewComponent} from "./admin-view/admin-view.component";
import {CreateContainerComponent} from "./create-container.component";
import {EditContainerComponent} from "./edit-container.component";
import {EditorViewComponent} from "./editor-view/editor-view.component";
import {ReactiveFormsModule} from "@angular/forms";
import {OptionEditorComponent} from "./editor-view/option-editor/option-editor.component";
import {AuthComponentsModule} from "../auth/auth-components.module";
import {ChoiceTableComponent} from "./admin-view/choice-table/choice-table.component";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AuthComponentsModule
  ],
  declarations: [ AdminContainerComponent, AdminViewComponent, CreateContainerComponent, EditContainerComponent, EditorViewComponent, OptionEditorComponent, ChoiceTableComponent ]
})
export class AdminModule {


}
