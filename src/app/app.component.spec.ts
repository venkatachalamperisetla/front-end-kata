import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { ConfigureFn, configureTests } from 'lib/testing/config.helper';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [NoopAnimationsModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the app', async(() => {
    const app = component;
    expect(app).toBeTruthy();
  }));
});
