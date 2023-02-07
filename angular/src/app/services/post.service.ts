import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Post } from 'src/app/models/post';
import { ContractService } from 'src/app/services/contract-service.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  constructor(
    private apollo: Apollo,
    private contractService: ContractService,
  ){}

  add({ cid }: Post){
    return this.contractService.contract.createPost(
      cid
    );
  }

  get(id: string){
    /**
      query get($id: String) {
        posts(where: {postId: $id}) { id postId hidden cid likes flags }
      }
    */
    return this.apollo.watchQuery({
      query: gql `
        query get($id: String) {
          post(id: $id) { id postId hidden cid likes flags }
        }
      `,
      variables: {
        id
      }
    })
  }

  getAll(){
    return this.apollo.watchQuery({
      query: gql`{
        posts(first: 5) {
          id postId hidden cid likes flags
        }
      }
      `
    })
  }
}
