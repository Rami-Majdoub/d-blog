// SPDX-License-Identifier: MIT
pragma solidity = 0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DBlog is Ownable {

	struct Post {
		address account;
		string cid;
		mapping(address => bool) likes;
		mapping(address => bool) flags;
		uint totalFlags;
		bool hidden;
	}

	event PostCreated(uint postId, string cid);
	event PostUpdated(uint postId, string cid);
	event PostDeleted(uint postId);
	event PostLiked(uint postId);
	event PostFlagged(uint postId);

	mapping(uint => Post) public posts;

	Counters.Counter public postMaxId;
	using Counters for Counters.Counter;

	function createPost(string calldata _cid) external onlyOwner /** for testing */ {
		// Post storage post = Post({
		// 	account: msg.sender,
		// 	cid: _cid,
		// 	flags: 0,
		// 	flagged: false
		// });
		
		// uint postId = postMaxId.current();
		// posts[postId] = post;
		// postMaxId.increment();

		uint postId = postMaxId.current();
		Post storage post = posts[postId];

		post.account = msg.sender;
		post.cid = _cid;
		post.hidden = false;

		postMaxId.increment();

		emit PostCreated(postId, _cid);
	}

	function updatePost(uint _id, string calldata _cid)
		postExists(_id)
		postPublisher(_id)
		postNotHidden(_id)
		external
	{
		Post storage post = posts[_id];
		post.cid = _cid;

		emit PostUpdated(_id, _cid);
	}

	function deletePost(uint _id) 
		postExists(_id)
		postPublisher(_id)
		external
	{
		delete posts[_id];
		emit PostDeleted(_id);
	}

	modifier postExists(uint id){
		require(id < postMaxId.current(), "Post does not exist");
		_;
	}

	modifier notPostPublisher(uint id){
		require(msg.sender != posts[id].account, "you are post owner");
		_;
	}

	modifier postPublisher(uint id){
		require(msg.sender == posts[id].account, "you are not post owner");
		_;
	}

	modifier postNotHidden(uint id){
		require(!posts[id].hidden, "post is hidden");
		_;
	}

	modifier postHidden(uint id){
		require(posts[id].hidden, "post is not hidden");
		_;
	}

	function likePost(uint postId)
		external
		postExists(postId)
		notPostPublisher(postId)
		postNotHidden(postId)
		returns (bool liked)
	{
		Post storage post = posts[postId];
		post.likes[msg.sender] = true;

		emit PostLiked(postId);

		return true;
	}

	modifier postNotFlagged(uint postId) {
		require(!posts[postId].flags[msg.sender], "account has flagged post");
		_;
	}

	function flagPost(uint postId)
		external
		postExists(postId)
		notPostPublisher(postId)
		postNotFlagged(postId)
		returns (bool flagged) 
	{
		Post storage post = posts[postId];

		post.flags[msg.sender] = true;
		post.totalFlags++;

		if(post.totalFlags >= maxFlags){
			post.hidden = true;
		}

		emit PostFlagged(postId);

		return (true);
	}

	uint public maxFlags = 3;
	function setMaxFlags(uint _flags) external onlyOwner {
		maxFlags = _flags;
	}

}
