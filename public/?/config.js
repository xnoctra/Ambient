/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/search/windowsrc-amb/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/search/handler.js',
    client: '/search/client.js',
    bundle: '/search/bundle.js',
    config: '/search/config.js',
    sw: '/search/sw-.js',
};
