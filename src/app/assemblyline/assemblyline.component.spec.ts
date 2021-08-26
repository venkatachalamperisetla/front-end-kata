import { By } from '@angular/platform-browser';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { AssemblyLineComponent } from './assemblyline.component';
import { AssemblyLineModule } from './assemblyline.module';
import { ConfigureFn, configureTests } from 'lib/testing/config.helper';

/* This test suite will not be submitted with your solution.
   Feel free to modify it as you wish. */

@Component({
  selector: "test-wrapper-component",
  template: `<assemblyline [stages]="[
    'Idea', 'Development', 'Testing', 'Deployment'
  ]"></assemblyline>`
})

class TestComponentWrapper {
  assemblyline = new AssemblyLineComponent();
}

describe("AssemblyLineComponent", () => {
  let component: AssemblyLineComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  const addAll = items => {
    const addElem = fixture.debugElement.query(
      By.css('*[data-test="assembly-add-item"]')
    );
    expect(addElem).not.toBeNull();
    items.forEach(e => {
      addElem.nativeElement.value = e;
      addElem.nativeElement.dispatchEvent(new Event("input"));
      addElem.triggerEventHandler("keydown.enter", {});
    });
  };

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [TestComponentWrapper],
        imports: [AssemblyLineModule],
        providers: [{
          provide: ComponentFixtureAutoDetect,
          useValue: true
        }]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(TestComponentWrapper);
      component = fixture.debugElement.children[0].componentInstance;
      fixture.detectChanges();
    });
  }));

  describe("renders correct elements", () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it("should have an element with the data-test attribute 'assembly-add-item'", () => {
      const addElem = fixture.debugElement.query(
        By.css('*[data-test="assembly-add-item"]')
      );
      expect(addElem).not.toBeNull();
    });

    it("should have 4 elements with the 'assembly-stage' data-test attribute", () => {
      const stageElems = fixture.debugElement.queryAll(
        By.css('*[data-test="assembly-stage"]')
      );
      expect(stageElems).not.toBeNull();
      expect(stageElems.length).toEqual(4);
    });

    it("should have 0 elements with the 'assembly-item' data-test attribute initially", () => {
      const itemsElem = fixture.debugElement.query(
        By.css('*[data-test="assembly-item"]')
      );
      expect(itemsElem).toBeNull();
    });
  });

  describe("adding assembly items", () => {
    describe('when "goldenrod" is typed into data-test "assembly-add-item"', () => {
      let addElem;

      beforeEach(() => {
        addElem = fixture.debugElement.query(
          By.css('*[data-test="assembly-add-item"]')
        );
        expect(addElem).not.toBeNull();
        addElem.nativeElement.value = "goldenrod";
        addElem.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();
      });

      it('should display entered text inside of "assembly-add-item"', () => {
        expect(addElem).not.toBeNull();
        expect(addElem.nativeElement.value).toEqual("goldenrod");
      });

      describe('when enter key is pressed on "assembly-add-item"', () => {
        beforeEach(() => {
          expect(addElem).not.toBeNull();
          addElem.triggerEventHandler("keydown.enter", {});
          fixture.detectChanges();
        });

        it('should respond to Enter keydown, clearing the input on "assembly-add-item"', () => {
          expect(addElem).not.toBeNull();
          expect(addElem.nativeElement.value).toEqual("");
        });

        it('should have a single item in the first stage after Enter on "assembly-add-item"', () => {
          const stageElem = fixture.debugElement.query(
            By.css('*[data-test="assembly-stage"]')
          );
          expect(stageElem).not.toBeNull();
          const children = stageElem.nativeElement.querySelectorAll('*[data-test="assembly-item"]');
          expect(children).not.toBeNull();
          expect(children.length).toEqual(1);
          expect(children[0].innerHTML).toContain("goldenrod");
        });
      });
    });
  });

  describe("moving assembly items", () => {
    describe("with 4 items initially added to Idea stage", () => {
      const startItems = [
        "indigo",
        "turquoise",
        "magenta",
        "fuschia"
      ];

      const stages = () => fixture.debugElement.queryAll(
        By.css('*[data-test="assembly-stage"]')
      );
      const getStage = stageIndex => {
        const stage = stages()[stageIndex];
        expect(stage).toBeDefined();
        return stage.nativeElement
          .querySelectorAll('*[data-test="assembly-item"]');
      };

      beforeEach(fakeAsync(() => {
        addAll(startItems);
        fixture.detectChanges();
        tick();
      }));

      it("should initially list 4 items within Idea stage", () => {
        expect(getStage(0).length).toEqual(4);
      });

      it("should insert items in Idea stage in the correct order", () => {
        for (let i = 0; i < 4; i++) {
          expect(getStage(0)[i].innerHTML).toEqual(startItems[3-i]);
        }
      });

      describe("after first item in Idea stage is clicked", () => {
        beforeEach(() => getStage(0)[0].click());

        it("should prepend first item to the Development stage", () => {
          expect(getStage(0).length).toEqual(3);
          expect(getStage(1).length).toEqual(1);
          expect(getStage(0)[0].innerHTML).toEqual("magenta");
          expect(getStage(0)[1].innerHTML).toEqual("turquoise");
          expect(getStage(0)[2].innerHTML).toEqual("indigo");
          expect(getStage(1)[0].innerHTML).toEqual("fuschia");
        });

        describe("after the last item in the Idea stage is clicked", () => {
          beforeEach(() => {
            const stage = getStage(0);
            expect(stage.length).toEqual(3);
            stage[2].click();
          });

          it("should prepend last item to the Development stage", () => {
            expect(getStage(0).length).toEqual(2);
            expect(getStage(1).length).toEqual(2);
            expect(getStage(0)[0].innerHTML).toEqual("magenta");
            expect(getStage(0)[1].innerHTML).toEqual("turquoise");
            expect(getStage(1)[0].innerHTML).toEqual("indigo");
            expect(getStage(1)[1].innerHTML).toEqual("fuschia");
          });

          describe("adding another item mid-stream", () => {
            beforeEach(fakeAsync(() => {
              addAll(["maroon"]);
              fixture.detectChanges();
              tick();
            }));

            it("should prepend new item to the Development stage", () => {
              expect(getStage(0).length).toEqual(3);
              expect(getStage(1).length).toEqual(2);
              expect(getStage(0)[0].innerHTML).toEqual("maroon");
              expect(getStage(0)[1].innerHTML).toEqual("magenta");
              expect(getStage(0)[2].innerHTML).toEqual("turquoise");
              expect(getStage(1)[0].innerHTML).toEqual("indigo");
              expect(getStage(1)[1].innerHTML).toEqual("fuschia");
            });

            describe("moving middle item from Idea to Development", () => {
              beforeEach(() => {
                const stage = getStage(0);
                expect(stage.length).toEqual(3);
                stage[1].click();
              });

              it("should have length 2 in Idea and 3 in Development", () => {
                expect(getStage(0).length).toEqual(2);
                expect(getStage(1).length).toEqual(3);
                expect(getStage(0)[0].innerHTML).toEqual("maroon");
                expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                expect(getStage(1)[0].innerHTML).toEqual("magenta");
                expect(getStage(1)[1].innerHTML).toEqual("indigo");
                expect(getStage(1)[2].innerHTML).toEqual("fuschia");
              });

              describe("moving middle item from Development to Idea", () => {
                beforeEach(() => {
                  const stage = getStage(1);
                  expect(stage.length).toEqual(3);
                  stage[1].dispatchEvent(new MouseEvent("contextmenu"));
                });

                it("should have three in Idea and two in Development", () => {
                  expect(getStage(0).length).toEqual(3);
                  expect(getStage(1).length).toEqual(2);
                  expect(getStage(0)[0].innerHTML).toEqual("maroon");
                  expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                  expect(getStage(0)[2].innerHTML).toEqual("indigo");
                  expect(getStage(1)[0].innerHTML).toEqual("magenta");
                  expect(getStage(1)[1].innerHTML).toEqual("fuschia");
                });

                describe("moving items from Development to Testing", () => {
                  beforeEach(() => {
                    const stage = getStage(1);
                    expect(stage.length).toEqual(2);
                    stage[0].click();
                    stage[1].click();
                  });

                  it("should leave Development empty and Testing with two", () => {
                    expect(getStage(0).length).toEqual(3);
                    expect(getStage(1).length).toEqual(0);
                    expect(getStage(2).length).toEqual(2);
                    expect(getStage(0)[0].innerHTML).toEqual("maroon");
                    expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                    expect(getStage(0)[2].innerHTML).toEqual("indigo");
                    expect(getStage(2)[0].innerHTML).toEqual("fuschia");
                    expect(getStage(2)[1].innerHTML).toEqual("magenta");
                  });

                  describe("moving an item from Testing to Production", () => {
                    beforeEach(() => {
                      const stage = getStage(2);
                      expect(stage.length).toEqual(2);
                      stage[1].click();
                    });

                    it("should leave one item in both Testing and Production", () => {
                      expect(getStage(0).length).toEqual(3);
                      expect(getStage(1).length).toEqual(0);
                      expect(getStage(2).length).toEqual(1);
                      expect(getStage(3).length).toEqual(1);
                      expect(getStage(0)[0].innerHTML).toEqual("maroon");
                      expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                      expect(getStage(0)[2].innerHTML).toEqual("indigo");
                      expect(getStage(2)[0].innerHTML).toEqual("fuschia");
                      expect(getStage(3)[0].innerHTML).toEqual("magenta");
                    });

                    describe("moving an item backwards from Testing to Development", () => {
                      beforeEach(() => {
                        const stage = getStage(2);
                        expect(stage.length).toEqual(1);
                        stage[0].dispatchEvent(new MouseEvent("contextmenu"));
                      });

                      it("should leave one item in both Testing and Production", () => {
                        expect(getStage(0).length).toEqual(3);
                        expect(getStage(1).length).toEqual(1);
                        expect(getStage(2).length).toEqual(0);
                        expect(getStage(3).length).toEqual(1);
                        expect(getStage(0)[0].innerHTML).toEqual("maroon");
                        expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                        expect(getStage(0)[2].innerHTML).toEqual("indigo");
                        expect(getStage(1)[0].innerHTML).toEqual("fuschia");
                        expect(getStage(3)[0].innerHTML).toEqual("magenta");
                      });

                      describe("clear the rest of the list out", () => {
                        beforeEach(() => {
                          let stage = getStage(0);
                          expect(stage.length).toEqual(3);
                          stage[2].dispatchEvent(new MouseEvent("contextmenu"));

                          stage = getStage(1);
                          expect(stage.length).toEqual(1);
                          stage[0].dispatchEvent(new MouseEvent("contextmenu"));

                          stage = getStage(0);
                          expect(stage.length).toEqual(3);
                          stage[1].dispatchEvent(new MouseEvent("contextmenu"));

                          stage = getStage(3);
                          expect(stage.length).toEqual(1);
                          stage[0].click();

                          stage = getStage(0);
                          expect(stage.length).toEqual(2);
                          stage[1].dispatchEvent(new MouseEvent("contextmenu"));

                          stage = getStage(0);
                          expect(stage.length).toEqual(1);
                          stage[0].dispatchEvent(new MouseEvent("contextmenu"));
                        });

                        it("should be empty", () => {
                          for (let i = 0; i < 4; i++) {
                            expect(getStage(i).length).toEqual(0);
                          }
                        });
                      });
                    });

                    describe("removing an item from Idea", () => {
                      beforeEach(() => {
                        const stage = getStage(0);
                        expect(stage.length).toEqual(3);
                        stage[1].dispatchEvent(new MouseEvent("contextmenu"));
                      });

                      it("should leave one item in Testing", () => {
                        expect(getStage(0).length).toEqual(2);
                        expect(getStage(1).length).toEqual(0);
                        expect(getStage(2).length).toEqual(1);
                        expect(getStage(0)[0].innerHTML).toEqual("maroon");
                        expect(getStage(0)[1].innerHTML).toEqual("indigo");
                        expect(getStage(2)[0].innerHTML).toEqual("fuschia");
                      });
                    });

                    describe("removing an item from Production", () => {
                      beforeEach(() => {
                        const stage = getStage(3);
                        expect(stage.length).toEqual(1);
                        stage[0].click();
                      });

                      it("should clear Production", () => {
                        expect(getStage(0).length).toEqual(3);
                        expect(getStage(1).length).toEqual(0);
                        expect(getStage(2).length).toEqual(1);
                        expect(getStage(3).length).toEqual(0);
                        expect(getStage(0)[0].innerHTML).toEqual("maroon");
                        expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                        expect(getStage(0)[2].innerHTML).toEqual("indigo");
                        expect(getStage(2)[0].innerHTML).toEqual("fuschia");
                      });
                    });
                  });
                });
              });
            });
          });
        });

        describe("after the item within Development stage is contextually clicked", () => {
          beforeEach(() => {
            const stage = getStage(1);
            expect(stage.length).toEqual(1);
            stage[0].dispatchEvent(new MouseEvent("contextmenu"));
          });

          it("should have moved that item back to the Idea stage", () => {
            expect(getStage(0).length).toEqual(4);
            expect(getStage(1).length).toEqual(0);
            expect(getStage(2).length).toEqual(0);
            expect(getStage(0)[0].innerHTML).toEqual("magenta");
            expect(getStage(0)[1].innerHTML).toEqual("turquoise");
            expect(getStage(0)[2].innerHTML).toEqual("indigo");
            expect(getStage(0)[3].innerHTML).toEqual("fuschia");
          });
        });

        describe("after the item within Development stage is clicked", () => {
          beforeEach(() => {
            const stage = getStage(1);
            expect(stage.length).toEqual(1);
            stage[0].click();
          });

          it("should have moved that item to the Testing stage", () => {
            expect(getStage(0).length).toEqual(3);
            expect(getStage(1).length).toEqual(0);
            expect(getStage(2).length).toEqual(1);
            expect(getStage(0)[0].innerHTML).toEqual("magenta");
            expect(getStage(0)[1].innerHTML).toEqual("turquoise");
            expect(getStage(0)[2].innerHTML).toEqual("indigo");
            expect(getStage(2)[0].innerHTML).toEqual("fuschia");
          });

          describe("after the item within Testing stage is clicked", () => {
            beforeEach(() => {
              const stage = getStage(2);
              expect(stage.length).toEqual(1);
              stage[0].click();
            });

            it("should have moved that item to the Testing stage", () => {
              expect(getStage(0).length).toEqual(3);
              expect(getStage(1).length).toEqual(0);
              expect(getStage(2).length).toEqual(0);
              expect(getStage(3).length).toEqual(1);
              expect(getStage(0)[0].innerHTML).toEqual("magenta");
              expect(getStage(0)[1].innerHTML).toEqual("turquoise");
              expect(getStage(0)[2].innerHTML).toEqual("indigo");
              expect(getStage(3)[0].innerHTML).toEqual("fuschia");
            });

            describe("after the item within Deployment stage is clicked", () => {
              beforeEach(() => {
                const stage = getStage(3);
                expect(stage.length).toEqual(1);
                stage[0].click();
              });

              it("should have removed that item from the board", () => {
                expect(getStage(0).length).toEqual(3);
                expect(getStage(1).length).toEqual(0);
                expect(getStage(2).length).toEqual(0);
                expect(getStage(3).length).toEqual(0);
                expect(getStage(0)[0].innerHTML).toEqual("magenta");
                expect(getStage(0)[1].innerHTML).toEqual("turquoise");
                expect(getStage(0)[2].innerHTML).toEqual("indigo");
              });
            });
          });
        });
      });

      describe("after first item within Idea stage is contextually clicked", () => {
        beforeEach(() => {
          const stage = getStage(0);
          expect(stage.length).toEqual(4);
          stage[0].dispatchEvent(new MouseEvent("contextmenu"));
        });

        it("should have removed that item from the Idea stage", () => {
          expect(getStage(0).length).toEqual(3);
          expect(getStage(1).length).toEqual(0);
          expect(getStage(0)[0].innerHTML).toEqual("magenta");
          expect(getStage(0)[1].innerHTML).toEqual("turquoise");
          expect(getStage(0)[2].innerHTML).toEqual("indigo");
        });
      });
    });
  });
});
