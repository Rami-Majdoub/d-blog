import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  
  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
  ){}

  post: any;
  postContent: any;

  subscription: any;
  loading: boolean = true;
  error: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.subscription = this.postService.get(id).valueChanges
      .subscribe((result: any) => {
        this.post = result.data?.post
        // this.post = result.data?.posts[0]
        // console.log(result);
        // console.log(this.post);

        fetch('https://' + this.post?.cid + '.ipfs.dweb.link/')
          .then((response) => response.text())
          .then((data) => this.postContent = data);

        this.loading = result.loading
        this.error = result.error
      })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
