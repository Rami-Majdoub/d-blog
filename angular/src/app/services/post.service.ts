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

  edit({ id, cid }: Post){
    return this.contractService.contract.updatePost(
      id, cid
    );
  }

  get(id: string){
    return this.apollo.watchQuery({
      query: gql `
        query get($id: String) {
          post(id: $id) { id hidden cid likes flags }
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
        posts(where: {hidden: false}, orderBy: createdAt, orderDirection: desc) {
          id hidden cid likes flags createdAt
        }
      }
      `
    })
  }
}
