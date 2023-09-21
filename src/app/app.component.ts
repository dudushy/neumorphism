/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ChangeDetectorRef } from '@angular/core';

import { DbService } from './services/db/db.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AppComponent';

  allPages: any = [];
  currentPage: any = null;

  theme = 'dark';
  showMenu = false;
  hasScrollbar = false;
  rainInterval: any;

  constructor(
    public db: DbService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public location: Location
  ) {
    console.log(`[${this.title}#constructor]`);

    const rawAllPages = this.router.config;
    console.log(`[${this.title}#constructor] rawAllPages`, rawAllPages);

    this.allPages = rawAllPages.filter((page: any) => {
      return (
        page.path !== '' &&
        page.path !== '**'
      );
    });

    console.log(`[${this.title}#constructor] allPages`, this.allPages);

    // this.redirectTo(this.db.get('last_page') || '', this.title); //! BUG OR FEATURE???

    this.theme = this.db.get('theme') || 'dark';
    this.toggleTheme(this.theme);

    window.onresize = () => {
      console.log(`[${this.title}#window.onresize]`);

      this.detectScrollbar();
    };

    window.onload = () => {
      console.log(`[${this.title}#window.onload]`);

      this.currentPage = this.router.url.split('/')[1];
      if (this.currentPage == '' || this.currentPage == 'home') window.history.pushState({}, '', '/');

      this.detectScrollbar();
    };
  }

  updateView(from: string) {
    console.log(`[${this.title}#updateView] from`, from);
    this.cdr.detectChanges;
  }

  async redirectTo(url: any, from: any) {
    console.log(`[${this.title}#redirectTo] ${from} | url`, [url]);

    // { skipLocationChange: true }
    await this.router.navigateByUrl(`/${url}`);

    if (url == '' || url == 'home') window.history.pushState({}, '', '/');

    this.currentPage = url;
    this.db.set('last_page', url);
    console.log(`[${this.title}#redirectTo] last_page`, [this.db.get('last_page')]);

    this.detectScrollbar();

    this.updateView(this.title);
  }

  defaultOrder() { return 0; }

  toggleTheme(theme: any) {
    console.log(`[${this.title}#toggleTheme] theme`, theme);

    this.theme = theme;
    this.db.set('theme', theme);

    document.documentElement.setAttribute('theme', theme);
    document.documentElement.style.setProperty('--theme', theme);

    this.updateView(this.title);
  }

  toggleMenu() {
    console.log(`[${this.title}#toggleMenu] showMenu`, this.showMenu);

    this.showMenu = !this.showMenu;

    const menuDiv = document.getElementById('menuDiv');
    console.log(`[${this.title}#toggleMenu] menuDiv`, menuDiv);

    menuDiv.className = this.showMenu ? 'show' : 'hide';
  }

  detectScrollbar() {
    const appRoot = document.querySelector('app-root');
    console.log(`[${this.title}#detectScrollbar] appRoot`, appRoot);

    this.hasScrollbar = appRoot.scrollHeight > appRoot.clientHeight;
    console.log(`[${this.title}#detectScrollbar] hasScrollbar`, this.hasScrollbar);
  }

  openLink(url) {
    window.open(url, '_blank');
  }
}
