# Exclusive Containers

A supplementary Firefox addon to [Multi-Account Containers](https://addons.mozilla.org/en-GB/firefox/addon/multi-account-containers/) (MAC) that will prevent links from opening in the same container as the originating container unless it's on the same domain. If not the same domain the link will open in the default container instead (or another container if the link's domain is designated a container as well, handled by MAC).

[Available on addons.mozilla.org](https://addons.mozilla.org/en-GB/firefox/addon/exclusive-containers/)

For more information about containers, see this blog post from Mozilla:  
<https://blog.mozilla.org/firefox/introducing-firefox-multi-account-containers/>

### Building

```bash
web-ext build
web-ext sign --api-key ... --api-secret ...
```
