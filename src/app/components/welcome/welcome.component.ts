import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personCircle,
  qrCodeOutline,
  mapOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ProfileImageService } from 'src/app/services/profile-image.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, CommonModule, RouterModule]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  user: User = new User();
  private authSubscription: Subscription | undefined;

  constructor(
    private auth: AuthService,
    private profileImageService: ProfileImageService
  ) { 
    addIcons({ 
      personCircle,
      qrCodeOutline,
      mapOutline
    });
  }

  async ngOnInit() {
    const currentUser = await this.auth.readAuthUser();
    if (currentUser) {
      this.user = currentUser;
    }

    this.authSubscription = this.auth.authUser.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getProfileImage(): string {
    return this.profileImageService.getProfileImage(this.user.image);
  }
}