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

function bigIntToBytes(value: BigInt): Bytes{
  return changetype<Bytes>(Bytes.fromBigInt(value));
}

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
  
  let entity = new Post(bigIntToBytes(event.params.postId))
  
  entity.postId = event.params.postId
  entity.cid = event.params.cid
  entity.likes = BigInt.zero()
  entity.flags = BigInt.zero()
  entity.hidden = false

  entity.createdAt = event.block.timestamp
  entity.updatedAt = event.block.timestamp

  entity.save()
}

export function handlePostDeleted(event: PostDeletedEvent): void {
  let id = bigIntToBytes(event.params.postId)
  let entity = Post.load(id)
  if(!entity) return;
 	store.remove('Post', id.toString())
}

export function handlePostFlagged(event: PostFlaggedEvent): void {
  let entity = Post.load(bigIntToBytes(event.params.postId))
  if(!entity) return;
  
  entity.flags.plus(BigInt.fromI32(1))

	// todo: handle hide after flags reach maxFlags

  entity.save()
}

export function handlePostLiked(event: PostLikedEvent): void {
  let entity = Post.load(bigIntToBytes(event.params.postId))
  if(!entity) return;

  entity.likes.plus(BigInt.fromI32(1))

  entity.save()
}

export function handlePostUpdated(event: PostUpdatedEvent): void {
  let cid = event.params.cid;
  if(!cid) return;
  
  let entity = Post.load(bigIntToBytes(event.params.postId))
  if(!entity) return;

  entity.cid = event.params.cid
  entity.updatedAt = event.block.timestamp

  entity.save()
}
