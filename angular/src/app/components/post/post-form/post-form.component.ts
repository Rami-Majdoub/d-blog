import { Component, OnInit } from '@angular/core';
import { SimplemdeComponent, SimplemdeOptions } from 'ngx-simplemde';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Web3Storage, CIDString } from 'web3.storage';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { ContractService } from 'src/app/services/contract-service.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  apikey = "";
  constructor(
    public postService: PostService,
    public contractService: ContractService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ){}

  id: string | null = null;
  form = this.formBuilder.group({
    content:      new FormControl("", [ Validators.required ]),
    id:        new FormControl("", [ ]),
    // title:        new FormControl("", [ ]),
    // description:  new FormControl("", [ ]),
  });

	status = "";

  onSubmit(): void {
    if(!this.form.valid) return;
    const instance = this.form.value as Post;

		this.create(instance);
  }

	async uploadContentToFile(client:Web3Storage, content: string, fileName: string){
		return client.put([new File([content], fileName)])
	}

	async getCidOfFile(client:Web3Storage, cidOfRepo: string, fileName?: string){
		const res = await client.get(cidOfRepo)
		if (!res?.ok) {
	    throw new Error(`failed to get ${cidOfRepo} - [${res?.status}] ${res?.statusText}`)
	  }
		const files = await res.files()
		// if fileName is not specified choose the first file
		const firstFile = files[0];
		const file = fileName? files.find(file => file.name === fileName): firstFile;
		const rawCid = file?.cid;
		return rawCid;
	}

	doAndReturn(text: string = "", fn: Function): string {
		fn(text);
		return text;
	}

  create(instance: Post){
		const API_TOKEN = this.apikey;
		const client = new Web3Storage({ token: API_TOKEN })
    this.contractService.connectAccount()
			.then(() => this.doAndReturn("", () => this.status = "uploading file to ipfs"))
      .then(() => this.uploadContentToFile(client, instance.content, "index.md"))
      .then((cid: string) => this.doAndReturn(cid, console.log))
			.then((cid: string) => this.doAndReturn(cid, () => this.status = "getting file from ipfs"))
			.then((cid: string) => this.getCidOfFile(client, cid))
			.then((cid) => this.doAndReturn(cid, console.log))
			.then((cid) => this.doAndReturn(cid, () => this.status = "saving file cid on blockchain"))
      .then((cid) => instance.cid = cid)
      .then(() => instance.id? this.postService.edit(instance): this.postService.add(instance))
			.then((tx: any) => this.doAndReturn(tx, console.log))
      .then((tx: any) => this.doAndReturn(tx, () => this.status = "Transaction submitted: " + tx.hash))
			.then((tx: any) => tx.wait())
      .then(() => this.status = "Transaction confirmed")
      .catch((reason: Error) => this.status = "Error: " + reason.message);
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    if(!this.id) return;

    this.postService.get(this.id).result()
		.then(({ data }: { data: any }) => {
      const { __typename, ...post } = data.post;
			console.log(post);

      this.form.setValue({ id: data.post.id, content: "" });
			return data;
    })
		.then((data: any) => fetch('https://' + data?.post?.cid + '.ipfs.w3s.link/'))
		.then((response) => response.text())
		.then((content) => this.form.controls["content"].setValue(content));// set content only
  }

}
