/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AuthWidgetContainerComponent} from "./auth-widget-container.component";

describe('AuthWidgetContainerComponent', () => {
  let component: AuthWidgetContainerComponent;
  let fixture: ComponentFixture<AuthWidgetContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthWidgetContainerComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthWidgetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
