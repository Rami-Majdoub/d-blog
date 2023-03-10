export const contract_address = '0xD7c628CB735327eab71754E66d2700D1623bCEeD';
export const contract_abi = [
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'event PostCreated(uint256 postId, string cid)',
    'event PostDeleted(uint256 postId)',
    'event PostFlagged(uint256 postId)',
    'event PostLiked(uint256 postId)',
    'event PostUpdated(uint256 postId, string cid)',
    'function createPost(string _cid) @29000000',
    'function deletePost(uint256 _id) @29000000',
    'function flagPost(uint256 postId) returns (bool flagged) @29000000',
    'function likePost(uint256 postId) returns (bool liked) @29000000',
    'function maxFlags() view returns (uint256) @29000000',
    'function owner() view returns (address) @29000000',
    'function postMaxId() view returns (uint256 _value) @29000000',
    'function posts(uint256) view returns (address account, string cid, uint256 totalFlags, bool hidden) @29000000',
    'function renounceOwnership() @29000000',
    'function setMaxFlags(uint256 _flags) @29000000',
    'function transferOwnership(address newOwner) @29000000',
    'function updatePost(uint256 _id, string _cid) @29000000'
  ];
