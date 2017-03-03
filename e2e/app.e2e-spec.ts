import { MaterialAppPage } from './app.po';

describe('material-app App', () => {
  let page: MaterialAppPage;

  beforeEach(() => {
    page = new MaterialAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
