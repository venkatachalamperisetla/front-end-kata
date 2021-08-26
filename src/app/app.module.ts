import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AssemblyLineModule } from "./assemblyline/assemblyline.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AssemblyLineModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
