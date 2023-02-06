import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PostCreated,
  PostDeleted,
  PostFlagged,
  PostLiked,
  PostUpdated
} from "../generated/DBlog/DBlog"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPostCreatedEvent(
  postId: BigInt,
  cid: string
): PostCreated {
  let postCreatedEvent = changetype<PostCreated>(newMockEvent())

  postCreatedEvent.parameters = new Array()

  postCreatedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )
  postCreatedEvent.parameters.push(
    new ethereum.EventParam("cid", ethereum.Value.fromString(cid))
  )

  return postCreatedEvent
}

export function createPostDeletedEvent(postId: BigInt): PostDeleted {
  let postDeletedEvent = changetype<PostDeleted>(newMockEvent())

  postDeletedEvent.parameters = new Array()

  postDeletedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )

  return postDeletedEvent
}

export function createPostFlaggedEvent(postId: BigInt): PostFlagged {
  let postFlaggedEvent = changetype<PostFlagged>(newMockEvent())

  postFlaggedEvent.parameters = new Array()

  postFlaggedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )

  return postFlaggedEvent
}

export function createPostLikedEvent(postId: BigInt): PostLiked {
  let postLikedEvent = changetype<PostLiked>(newMockEvent())

  postLikedEvent.parameters = new Array()

  postLikedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )

  return postLikedEvent
}

export function createPostUpdatedEvent(
  postId: BigInt,
  cid: string
): PostUpdated {
  let postUpdatedEvent = changetype<PostUpdated>(newMockEvent())

  postUpdatedEvent.parameters = new Array()

  postUpdatedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )
  postUpdatedEvent.parameters.push(
    new ethereum.EventParam("cid", ethereum.Value.fromString(cid))
  )

  return postUpdatedEvent
}
