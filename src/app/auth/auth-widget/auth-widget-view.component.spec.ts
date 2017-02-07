/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AuthWidgetViewComponent} from "./auth-widget-view.component";

describe('AuthWidgetViewComponent', () => {
  let component: AuthWidgetViewComponent;
  let fixture: ComponentFixture<AuthWidgetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthWidgetViewComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
