import { Component } from '@angular/core'
import { Platform } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { TranslateService } from '@ngx-translate/core'
import { WelcomePage } from '../pages/welcome/welcome'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = WelcomePage

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translateService: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      translateService.setDefaultLang('en')
      translateService.use('en')
      statusBar.styleLightContent()
      statusBar.backgroundColorByHexString('#3296ff')
      splashScreen.hide()
    })
  }

}