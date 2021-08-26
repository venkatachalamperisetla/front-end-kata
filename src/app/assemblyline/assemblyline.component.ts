import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "assemblyline",
  templateUrl: "./assemblyline.component.html",
  styleUrls: ["./assemblyline.component.scss"]
})
export class AssemblyLineComponent implements OnInit {
  @Input() stages: string[];
  public assemblyObject: any = { addItem: "", stageObject: new Array() }

  constructor() { }

  ngOnInit() {
    for (const iterator of this.stages) {
      this.assemblyObject.stageObject.push({ label: iterator, content: new Array() });
    }
  }

  public assemblyAddItem() {
    if (this.assemblyObject.addItem) {
      this.assemblyObject.stageObject[0].content.push(this.assemblyObject.addItem);
      this.assemblyObject.addItem = "";
    }
  }

  public stageItem(eventType: string, data: string, index: number, event: any) {
    this.assemblyObject.stageObject[index].content = this.assemblyObject.stageObject[index].content.filter((item: any) => item !== data)
    if (eventType === "left") {
      if (index < (this.assemblyObject.stageObject.length - 1)) {
        this.assemblyObject.stageObject[index + 1].content.push(data);
      }
      return;
    }
    event.preventDefault()
    if (index !== 0) {
      this.assemblyObject.stageObject[index - 1].content.push(data);
    }
  }

}
