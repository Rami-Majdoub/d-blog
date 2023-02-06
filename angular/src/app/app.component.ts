import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract-service.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  posts: any[] = []
  loading = true
  error: any
  
  constructor(
    private apollo: Apollo,
    public contractService_: ContractService,
  ){}
  
  ngOnInit() {
    this.apollo.watchQuery({
      query: gql`{
        posts(first: 5) {
          id
          postId
          hidden
          cid
          likes
          flags
        }
      }
      `
      })
      .valueChanges.subscribe((result: any) => {
        this.posts = result.data?.posts

        fetch('https://' + this.posts[0]?.cid + '.ipfs.dweb.link/')
		  .then((response) => response.text())
		  .then((data) => this.post = data);

        this.loading = result.loading
        this.error = result.error
      })
  }
  post: any;
  
  account = 'not connected';
  async connect(){
    this.account = await this.contractService_.connectAccount();
  }
  
  cid = '';
  async set(){
    await this.contractService_.createPost(this.cid);
  }
}
