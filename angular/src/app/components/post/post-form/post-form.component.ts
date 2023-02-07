import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { ContractService } from 'src/app/services/contract-service.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {

  constructor(
    public postService: PostService,
    public contractService: ContractService,
    private formBuilder: FormBuilder,
  ){}
  
  id: string | null = null;
  form = this.formBuilder.group({
    cid:          new FormControl("", [ Validators.required ]),
    title:        new FormControl("", [ ]),
    description:  new FormControl("", [ ]),
  });

  onSubmit(): void {
    if(!this.form.valid) return;
    const instance = this.form.value as Post;

    if(this.id){
      instance.id = this.id;
      this.update(instance);
    } else {
      this.create(instance);
    }
  }

  create(instance: Post){
    this.contractService.connectAccount().then(
      this.postService.add(instance)
    )
  }

  update(instance: Post){
    
  }

}
