import { Component } from '@angular/core';

import { AboutPage } from '../history/history';
import { ContactPage } from '../preferences/preferences';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
