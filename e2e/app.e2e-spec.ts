import { RcvWidgetPage } from './app.po';

describe('rcv-widget App', function() {
  let page: RcvWidgetPage;

  beforeEach(() => {
    page = new RcvWidgetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('rcv works!');
  });
});
