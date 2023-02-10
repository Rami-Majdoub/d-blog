import { 
  Bytes,
  BigInt,
  store
} from '@graphprotocol/graph-ts'

import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PostCreated as PostCreatedEvent,
  PostDeleted as PostDeletedEvent,
  PostFlagged as PostFlaggedEvent,
  PostLiked as PostLikedEvent,
  PostUpdated as PostUpdatedEvent
} from "../generated/DBlog/DBlog"
import {
  OwnershipTransferred,
  Post,
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostCreated(event: PostCreatedEvent): void {
  let cid = event.params.cid;
  if(!cid) return;
  
  let entity = new Post(
    Bytes.fromI32(event.params.postId.toI32())
  )
  entity.postId = event.params.postId
  entity.cid = event.params.cid

  entity.likes = BigInt.fromI32(0)
  entity.flags = BigInt.fromI32(0)
  entity.hidden = false

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostDeleted(event: PostDeletedEvent): void {
  let id = Bytes.fromI32(event.params.postId.toI32());
  let entity = Post.load(id)
  if(entity){
  	store.remove('Post', id.toString())
  }
}

export function handlePostFlagged(event: PostFlaggedEvent): void {
  let entity = Post.load(Bytes.fromI32(event.params.postId.toI32()))
  if(entity){
  	entity.flags.plus(BigInt.fromI32(1))
  	
  	// todo: handle hide after flags reach maxFlags
  }
}

export function handlePostLiked(event: PostLikedEvent): void {
  let entity = Post.load(Bytes.fromI32(event.params.postId.toI32()))
  if(entity){
  	entity.likes.plus(BigInt.fromI32(1))
  }
}

export function handlePostUpdated(event: PostUpdatedEvent): void {
  let cid = event.params.cid;
  if(!cid) return;
  
  let entity = Post.load(Bytes.fromI32(event.params.postId.toI32()))
  if(!entity) return;

  entity.cid = event.params.cid

}
