import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: any[] = []
  
  subscription: any
  loading = true
  error: any

  constructor(
    public postService: PostService,
  ){}
  
  ngOnInit() {
    this.subscription = this.postService.getAll().valueChanges
      .subscribe((result: any) => {
        this.posts = result.data?.posts
        this.loading = result.loading
        this.error = result.error
      })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
