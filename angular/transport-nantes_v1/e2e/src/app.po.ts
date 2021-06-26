import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    //e1 e3 ( e3 descendant direct ou indirect de e1)
    //e1 > e2 (e2 fils direct de e1)
    // app-root div h1 si <div><h1>{{title}}... dans app.component.html
    //app-root app-header #app-header-title
    return element(by.css('app-root app-header #appHeaderTitle')).getText() as Promise<string>;
  }
}
