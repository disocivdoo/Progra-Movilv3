import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, 
  IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from 'src/app/model/post';
import { showToast } from 'src/app/tools/message-functions';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline, addOutline, saveOutline, refreshOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { ProfileImageService } from 'src/app/services/profile-image.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonAvatar
  ]
})
export class ForumComponent implements OnInit, OnDestroy {
  post: Post = new Post();
  posts: Post[] = [];
  selectedPostText = '';
  user = new User();
  private postsSubscription!: Subscription;
  private userSubscription!: Subscription;
  

  constructor(
    private api: APIClientService, 
    private auth: AuthService,
    private profileImageService: ProfileImageService
  ) {
    addIcons({ 
      pencilOutline, 
      trashOutline, 
      addOutline, 
      saveOutline,
      refreshOutline 
    });
  }

  ngOnInit() {
    this.postsSubscription = this.api.postList.subscribe((posts) => {
      this.posts = posts;
    });
    this.userSubscription = this.auth.authUser.subscribe((user) => {
      this.user = user ? user : new User();
    });
    this.api.refreshPostList();
    this.cleanPost();
  }

  ngOnDestroy() {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  cleanPost() {
    this.post = new Post();
    this.selectedPostText = '';
  }

  getProfileImage(): string {
    return this.profileImageService.getProfileImage(this.user.image);
  }

  async savePost() {
    if (!this.post.title.trim()) {
      showToast('Por favor, ingresa un título para tu publicación');
      return;
    }
    if (!this.post.body.trim()) {
      showToast('Por favor, ingresa el contenido de tu publicación');
      return;
    }

    try {
      this.post.author = `${this.user.firstName} ${this.user.lastName}`;
      this.post.date = new Date().toLocaleString();
      
      if (this.post.id) {
        const updatedPost = await this.api.updatePost(this.post);
        if (updatedPost) {
          showToast('Publicación actualizada exitosamente');
          this.cleanPost();
        }
      } else {
        const createdPost = await this.api.createPost(this.post);
        if (createdPost) {
          showToast('Publicación creada exitosamente');
          this.cleanPost();
        }
      }
    } catch (error) {
      showToast('Error al guardar la publicación');
      console.error(error);
    }
  }

  editPost(post: Post) {
    this.post = { ...post };
    this.selectedPostText = `Editando publicación #${post.id}`;
    document.getElementById('topOfPage')?.scrollIntoView({ behavior: 'smooth' });
  }

  async deletePost(post: Post) {
    try {
      const success = await this.api.deletePost(post.id);
      if (success) {
        showToast('Publicación eliminada exitosamente');
        this.cleanPost();
      }
    } catch (error) {
      showToast('Error al eliminar la publicación');
      console.error(error);
    }
  }

  getPostId(index: number, post: Post) {
    return post.id;
  }
}